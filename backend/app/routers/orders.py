import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.deps import get_current_user, get_optional_user
from app.models import Favorite, Order, Restaurant, User
from app.schemas import FavoriteIn, OrderCreateIn, OrderItemIn, OrderOut, RestaurantListItem
from app.serializers import restaurant_list_item

router = APIRouter(tags=["orders-favorites"])
settings = get_settings()


@router.post("/orders", response_model=OrderOut)
def create_order(
    body: OrderCreateIn,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    restaurant = db.get(Restaurant, body.restaurantId)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if not body.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    food_total = sum(i.price * i.qty for i in body.items)
    delivery_fee = 0 if restaurant.free_delivery else 8000
    service_fee = settings.service_fee
    total = food_total + delivery_fee + service_fee

    order = Order(
        user_id=user.id if user else None,
        restaurant_id=body.restaurantId,
        status="pending",
        recipient_name=body.recipientName,
        recipient_phone=body.recipientPhone,
        address=body.address,
        payment_method=body.paymentMethod,
        comment=body.comment,
        food_total=food_total,
        delivery_fee=delivery_fee,
        service_fee=service_fee,
        total=total,
        items_json=json.dumps([i.model_dump() for i in body.items], ensure_ascii=False),
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return OrderOut(
        id=order.id,
        restaurantId=order.restaurant_id,
        status=order.status,
        foodTotal=order.food_total,
        deliveryFee=order.delivery_fee,
        serviceFee=order.service_fee,
        total=order.total,
        items=body.items,
        recipientName=order.recipient_name,
        recipientPhone=order.recipient_phone,
        address=order.address,
        paymentMethod=order.payment_method,
    )


@router.get("/orders", response_model=list[OrderOut])
def my_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.id.desc())
        .all()
    )
    result: list[OrderOut] = []
    for o in rows:
        items = [OrderItemIn(**i) for i in json.loads(o.items_json or "[]")]
        result.append(
            OrderOut(
                id=o.id,
                restaurantId=o.restaurant_id,
                status=o.status,
                foodTotal=o.food_total,
                deliveryFee=o.delivery_fee,
                serviceFee=o.service_fee,
                total=o.total,
                items=items,
                recipientName=o.recipient_name,
                recipientPhone=o.recipient_phone,
                address=o.address,
                paymentMethod=o.payment_method,
            )
        )
    return result


@router.get("/favorites", response_model=list[RestaurantListItem])
def list_favorites(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav_ids = [
        f.restaurant_id
        for f in db.query(Favorite).filter(Favorite.user_id == user.id).all()
    ]
    if not fav_ids:
        return []
    rows = db.query(Restaurant).filter(Restaurant.id.in_(fav_ids)).all()
    return [restaurant_list_item(r) for r in rows]


@router.post("/favorites")
def add_favorite(
    body: FavoriteIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not db.get(Restaurant, body.restaurantId):
        raise HTTPException(status_code=404, detail="Restaurant not found")
    exists = (
        db.query(Favorite)
        .filter(Favorite.user_id == user.id, Favorite.restaurant_id == body.restaurantId)
        .first()
    )
    if not exists:
        db.add(Favorite(user_id=user.id, restaurant_id=body.restaurantId))
        db.commit()
    return {"ok": True}


@router.delete("/favorites/{restaurant_id}")
def remove_favorite(
    restaurant_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(Favorite)
        .filter(Favorite.user_id == user.id, Favorite.restaurant_id == restaurant_id)
        .first()
    )
    if row:
        db.delete(row)
        db.commit()
    return {"ok": True}
