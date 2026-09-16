from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MenuItem, Restaurant
from app.schemas import MenuCategoryOut, MenuDishOut, RestaurantDetailOut, RestaurantListItem
from app.serializers import dish_to_out, restaurant_detail, restaurant_list_item

router = APIRouter(prefix="/restaurants", tags=["restaurants"])

MENU_CATEGORIES = [
    MenuCategoryOut(id="all", label="Barchasi"),
    MenuCategoryOut(id="popular", label="Mashhur taomlar"),
    MenuCategoryOut(id="osh", label="Osh turlari"),
    MenuCategoryOut(id="shashlik", label="Shashlik & Tandir"),
    MenuCategoryOut(id="salad", label="Salatlar & Gazaklar"),
    MenuCategoryOut(id="dessert", label="Shirinliklar"),
    MenuCategoryOut(id="drinks", label="Ichimliklar"),
]

CATEGORY_ALIASES = {
    "fastfood": ["burger", "fastfood"],
    "pitsa": ["pizza"],
    "shirinliklar": ["dessert"],
}


@router.get("", response_model=list[RestaurantListItem])
def list_restaurants(
    q: str | None = Query(None),
    category: str | None = Query(None),
    free_delivery: bool | None = Query(None),
    open_now: bool | None = Query(None),
    price_tier: int | None = Query(None),
    min_rating: float | None = Query(None),
    max_eta: int | None = Query(None),
    sort: str = Query("popular"),
    db: Session = Depends(get_db),
):
    query = db.query(Restaurant)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(Restaurant.name.ilike(like), Restaurant.tags_json.ilike(like))
        )
    if category:
        ids = CATEGORY_ALIASES.get(category, [category])
        query = query.filter(Restaurant.category_id.in_(ids))
    if free_delivery is True:
        query = query.filter(Restaurant.free_delivery.is_(True))
    if open_now is True:
        query = query.filter(Restaurant.open_now.is_(True))
    if price_tier:
        query = query.filter(Restaurant.price_tier == price_tier)
    if min_rating is not None:
        query = query.filter(Restaurant.rating >= min_rating)
    if max_eta is not None:
        query = query.filter(Restaurant.delivery_minutes <= max_eta)

    rows = query.all()
    if sort == "rating":
        rows.sort(key=lambda r: r.rating, reverse=True)
    elif sort == "eta":
        rows.sort(key=lambda r: r.delivery_minutes)
    elif sort == "distance":
        rows.sort(key=lambda r: float(r.distance.replace(" km", "") or 0))
    else:
        rows.sort(key=lambda r: r.rating, reverse=True)

    return [restaurant_list_item(r) for r in rows]


@router.get("/{restaurant_id}", response_model=RestaurantDetailOut)
def get_restaurant(restaurant_id: str, db: Session = Depends(get_db)):
    row = db.get(Restaurant, restaurant_id)
    if not row:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant_detail(row)


@router.get("/{restaurant_id}/menu", response_model=list[MenuDishOut])
def get_menu(
    restaurant_id: str,
    category: str | None = Query(None),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if not db.get(Restaurant, restaurant_id):
        raise HTTPException(status_code=404, detail="Restaurant not found")

    query = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant_id,
        MenuItem.available.is_(True),
    )
    if category == "popular":
        query = query.filter(MenuItem.popular.is_(True))
    elif category and category != "all":
        query = query.filter(MenuItem.category == category)
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(MenuItem.name.ilike(like) | MenuItem.description.ilike(like))

    return [dish_to_out(d) for d in query.all()]


@router.get("/{restaurant_id}/menu-categories", response_model=list[MenuCategoryOut])
def menu_categories(restaurant_id: str, db: Session = Depends(get_db)):
    if not db.get(Restaurant, restaurant_id):
        raise HTTPException(status_code=404, detail="Restaurant not found")

    dishes = (
        db.query(MenuItem)
        .filter(MenuItem.restaurant_id == restaurant_id, MenuItem.available.is_(True))
        .all()
    )
    if not dishes:
        return MENU_CATEGORIES

    label_map = {
        "osh": "Asosiy taomlar",
        "shashlik": "Shashlik & Tandir",
        "salad": "Salatlar & Gazaklar",
        "dessert": "Shirinliklar",
        "drinks": "Ichimliklar",
    }
    cats = [
        MenuCategoryOut(id="all", label="Barchasi"),
        MenuCategoryOut(id="popular", label="Mashhur taomlar"),
    ]
    seen: set[str] = set()
    for dish in dishes:
        if dish.category in seen:
            continue
        seen.add(dish.category)
        cats.append(
            MenuCategoryOut(
                id=dish.category,
                label=label_map.get(dish.category, dish.category.title()),
            )
        )
    return cats
