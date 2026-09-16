from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Category
from app.schemas import CategoryOut
from app.serializers import category_to_out

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
def list_categories(
    group: str | None = Query(None),
    popular: bool | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Category)
    if group and group != "all":
        q = q.filter(Category.group == group)
    if popular is True:
        q = q.filter(Category.popular.is_(True))
    rows = q.order_by(Category.popularity.desc()).all()
    return [category_to_out(c) for c in rows]


@router.get("/{category_id}", response_model=CategoryOut)
def get_category(category_id: str, db: Session = Depends(get_db)):
    row = db.get(Category, category_id)
    if not row:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Category not found")
    return category_to_out(row)
