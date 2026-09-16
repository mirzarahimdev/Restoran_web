from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Promotion
from app.schemas import FeaturedPromoOut, PromotionOut
from app.serializers import promotion_to_out

router = APIRouter(prefix="/promotions", tags=["promotions"])

FEATURED_ENDS_AT = datetime.now(UTC) + timedelta(hours=6, minutes=42, seconds=18)


@router.get("", response_model=list[PromotionOut])
def list_promotions(
    filter: str | None = Query(None, alias="filter"),
    sort: str = Query("popular"),
    db: Session = Depends(get_db),
):
    rows = db.query(Promotion).filter(Promotion.active.is_(True)).all()
    if filter and filter != "all":
        if filter == "free":
            rows = [p for p in rows if p.free_delivery]
        elif filter == "new":
            rows = [p for p in rows if p.is_new]
        elif filter == "combo":
            rows = [p for p in rows if "combo" in (p.filter_tags_json or "")]
        elif filter.isdigit():
            min_disc = int(filter)
            rows = [p for p in rows if (p.discount_percent or 0) >= min_disc]

    if sort == "discount":
        rows.sort(key=lambda p: p.discount_percent or 0, reverse=True)
    elif sort == "rating":
        rows.sort(key=lambda p: p.rating, reverse=True)
    else:
        rows.sort(key=lambda p: p.popularity, reverse=True)

    return [promotion_to_out(p) for p in rows]


@router.get("/featured", response_model=FeaturedPromoOut)
def featured_promotion(db: Session = Depends(get_db)):
    rows = db.query(Promotion).filter(Promotion.active.is_(True)).all()
    if not rows:
        raise HTTPException(status_code=404, detail="No active promotions")

    featured = max(rows, key=lambda p: (p.discount_percent or 0, p.popularity))
    remaining = max(0, int((FEATURED_ENDS_AT - datetime.now(UTC)).total_seconds()))

    return FeaturedPromoOut(
        promotionId=featured.id,
        restaurantId=featured.restaurant_id,
        tag="FAQAT BUGUN",
        title="Bugun 30% gacha chegirma!",
        description=(
            "Milliy taomlar, tandir somsalar va pitsalarga maxsus chegirma. "
            "Bugun buyurtma bering — aksiyadan foydalanib qoling."
        ),
        cta="Aksiyani ko‘rish",
        image=featured.image,
        imageBadge=f"Chef's Selection • {featured.name}",
        secondsRemaining=remaining,
        activePromoCount=len(rows),
    )
