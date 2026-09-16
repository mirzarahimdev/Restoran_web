import json
import secrets
import urllib.error
import urllib.request

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import (
    GoogleAuthIn,
    LoginIn,
    PasswordChangeIn,
    RegisterIn,
    TokenOut,
    UserOut,
    UserUpdateIn,
)
from app.security import create_access_token, hash_password, verify_password
from app.serializers import user_to_out

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token(user: User) -> TokenOut:
    return TokenOut(accessToken=create_access_token(str(user.id)), user=user_to_out(user))


def _find_by_email(db: Session, email: str) -> User | None:
    normalized = email.strip().lower()
    return (
        db.query(User)
        .filter(User.email.isnot(None), func.lower(User.email) == normalized)
        .first()
    )


@router.post("/register", response_model=TokenOut)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    phone = body.phone.strip()
    email = str(body.email).strip().lower() if body.email else None

    by_phone = db.query(User).filter(User.phone == phone).first()
    by_email = _find_by_email(db, email) if email else None

    if by_phone and by_email and by_phone.id != by_email.id:
        raise HTTPException(
            status_code=400,
            detail="Telefon va email turli akkauntlarga tegishli. Boshqa ma'lumot kiriting yoki tizimga kiring.",
        )

    existing = by_phone or by_email
    if existing:
        if verify_password(body.password, existing.password_hash):
            existing.full_name = body.fullName.strip() or existing.full_name
            if email and not existing.email:
                existing.email = email
            db.commit()
            db.refresh(existing)
            return _issue_token(existing)
        if by_email:
            raise HTTPException(
                status_code=400,
                detail="Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasidan kiring.",
            )
        raise HTTPException(
            status_code=400,
            detail="Bu telefon raqami allaqachon ro'yxatdan o'tgan. Kirish sahifasidan kiring.",
        )

    user = User(
        full_name=body.fullName.strip(),
        phone=phone,
        email=email,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _issue_token(user)


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn, db: Session = Depends(get_db)):
    if not body.phone and not body.email:
        raise HTTPException(status_code=400, detail="Telefon yoki email kerak")

    user: User | None = None
    if body.email:
        user = _find_by_email(db, str(body.email))
    else:
        user = db.query(User).filter(User.phone == (body.phone or "").strip()).first()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telefon/email yoki parol noto'g'ri",
        )
    return _issue_token(user)


def _google_userinfo(access_token: str) -> dict:
    req = urllib.request.Request(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise HTTPException(status_code=401, detail="Google token noto'g'ri") from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail="Google tekshiruvi muvaffaqiyatsiz") from exc


@router.post("/google", response_model=TokenOut)
def google_auth(body: GoogleAuthIn, db: Session = Depends(get_db)):
    info = _google_userinfo(body.accessToken)
    google_id = info.get("sub")
    email = (info.get("email") or "").strip().lower()
    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Google profilida email topilmadi")

    settings = get_settings()
    if settings.google_client_id:
        pass

    full_name = (info.get("name") or email.split("@")[0]).strip() or "Google User"
    avatar = info.get("picture")

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user and email:
        user = _find_by_email(db, email)

    if user:
        if not user.google_id:
            user.google_id = google_id
        if avatar and not user.avatar:
            user.avatar = avatar
        if full_name and user.full_name.startswith("g:"):
            user.full_name = full_name
        db.commit()
        db.refresh(user)
    else:
        phone = f"g:{google_id}"[:32]
        if db.query(User).filter(User.phone == phone).first():
            phone = f"g:{secrets.token_hex(8)}"
        user = User(
            full_name=full_name,
            phone=phone,
            email=email,
            google_id=google_id,
            avatar=avatar,
            password_hash=hash_password(secrets.token_urlsafe(32)),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return _issue_token(user)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user_to_out(user)


@router.patch("/me", response_model=UserOut)
def update_me(
    body: UserUpdateIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.fullName is not None:
        user.full_name = body.fullName.strip()

    if body.phone is not None:
        phone = body.phone.strip()
        taken = db.query(User).filter(User.phone == phone, User.id != user.id).first()
        if taken:
            raise HTTPException(status_code=400, detail="Bu telefon raqami band")
        user.phone = phone

    if body.email is not None:
        email = str(body.email).strip().lower()
        taken = _find_by_email(db, email)
        if taken and taken.id != user.id:
            raise HTTPException(status_code=400, detail="Bu email band")
        user.email = email

    if body.avatar is not None:
        user.avatar = body.avatar.strip() or None

    db.commit()
    db.refresh(user)
    return user_to_out(user)


@router.post("/change-password")
def change_password(
    body: PasswordChangeIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(body.currentPassword, user.password_hash):
        raise HTTPException(status_code=400, detail="Joriy parol noto'g'ri")
    user.password_hash = hash_password(body.newPassword)
    db.commit()
    return {"ok": True}
