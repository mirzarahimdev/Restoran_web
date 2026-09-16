from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MenuItem, Restaurant
from app.schemas import PopularDishOut

router = APIRouter(prefix="/dishes", tags=["dishes"])


def _to_popular(dish: MenuItem, rest: Restaurant) -> PopularDishOut:
    price_label = f"{dish.price:,}".replace(",", " ") + " so'm"
    return PopularDishOut(
        id=dish.id,
        restaurantId=rest.id,
        restaurant=rest.name,
        name=dish.name,
        description=dish.description,
        price=price_label,
        priceAmount=dish.price,
        rating=rest.rating,
        image=dish.image,
        tag=dish.badge,
    )


@router.get("/popular", response_model=list[PopularDishOut])
def popular_dishes(
    limit: int = Query(8, ge=1, le=24),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(MenuItem, Restaurant)
        .join(Restaurant, MenuItem.restaurant_id == Restaurant.id)
        .filter(MenuItem.popular.is_(True), MenuItem.available.is_(True))
        .order_by(Restaurant.rating.desc(), MenuItem.price.desc())
        .limit(limit)
        .all()
    )
    return [_to_popular(dish, rest) for dish, rest in rows]


@router.get("/search", response_model=list[PopularDishOut])
def search_dishes(
    q: str = Query(..., min_length=1),
    limit: int = Query(24, ge=1, le=50),
    db: Session = Depends(get_db),
):
    like = f"%{q.strip()}%"
    rows = (
        db.query(MenuItem, Restaurant)
        .join(Restaurant, MenuItem.restaurant_id == Restaurant.id)
        .filter(
            MenuItem.available.is_(True),
            MenuItem.name.ilike(like) | MenuItem.description.ilike(like),
        )
        .order_by(Restaurant.rating.desc(), MenuItem.popular.desc())
        .limit(limit)
        .all()
    )
    return [_to_popular(dish, rest) for dish, rest in rows]
