import json

from app.models import Category, MenuItem, Promotion, Restaurant, User
from app.schemas import (
    BadgeOut,
    CategoryOut,
    MenuDishOut,
    PromotionOut,
    RestaurantDetailOut,
    RestaurantListItem,
    UserOut,
)


def format_sum(n: int) -> str:
    return f"{n:,}".replace(",", " ") + " so'm"


def category_to_out(c: Category) -> CategoryOut:
    return CategoryOut(
        id=c.id,
        name=c.name,
        count=c.count_label or f"{c.restaurant_count}+ joy",
        image=c.image,
        thumb=c.thumb or c.image,
        description=c.description,
        group=c.group,
        queryParam=c.query_param or c.id,
        badge=c.badge,
        badgeTone=c.badge_tone,
        restaurantCount=c.restaurant_count,
        popularity=c.popularity,
        popular=c.popular,
    )


def restaurant_list_item(r: Restaurant) -> RestaurantListItem:
    tags = json.loads(r.tags_json or "[]")
    badges_raw = json.loads(r.badges_json or "[]")
    badges = [BadgeOut(label=b["label"], tone=b.get("tone", "orange")) for b in badges_raw]
    return RestaurantListItem(
        id=r.id,
        name=r.name,
        rating=r.rating,
        reviews=r.reviews_label,
        eta=r.eta,
        distance=r.distance,
        delivery=r.delivery_fee,
        minOrder=r.min_order,
        tags=tags,
        badges=badges,
        image=r.image,
        freeDelivery=r.free_delivery,
        open=r.open_now,
        priceTier=r.price_tier,
        category=r.category_id,
        deliveryMinutes=r.delivery_minutes,
    )


def restaurant_detail(r: Restaurant) -> RestaurantDetailOut:
    tags = json.loads(r.tags_json or "[]")
    return RestaurantDetailOut(
        id=r.id,
        name=r.name,
        logo=r.logo or r.image,
        cover=r.cover or r.image,
        verified=r.verified,
        cuisine=r.cuisine or (tags[0] if tags else ""),
        description=r.description,
        rating=r.rating,
        reviews=r.reviews_label if r.reviews_label.endswith("+") else f"{r.reviews_label}+",
        hours=r.hours,
        address=r.address,
        deliveryTime=r.delivery_time or r.eta.replace("daq", "daqiqa"),
        deliveryFee="Bepul aksiya" if r.free_delivery else r.delivery_fee,
        freeDelivery=r.free_delivery,
        minOrder=r.min_order,
        accepting=r.accepting and r.open_now,
        category=r.category_id,
        tags=tags,
    )


def dish_to_out(d: MenuItem) -> MenuDishOut:
    ingredients = json.loads(d.ingredients_json or "[]")
    return MenuDishOut(
        id=d.id,
        name=d.name,
        description=d.description,
        price=d.price,
        priceLabel=format_sum(d.price),
        image=d.image,
        badge=d.badge,
        weight=d.weight,
        category=d.category,
        popular=d.popular,
        ingredients=ingredients if isinstance(ingredients, list) else [],
    )


def promotion_to_out(p: Promotion) -> PromotionOut:
    return PromotionOut(
        id=p.id,
        restaurantId=p.restaurant_id,
        name=p.name,
        cuisine=p.cuisine,
        rating=p.rating,
        reviews=p.reviews,
        eta=p.eta,
        price=p.price,
        oldPrice=p.old_price,
        delivery=p.delivery,
        freeDelivery=p.free_delivery,
        badge=p.badge,
        badgeTone=p.badge_tone,
        filterTags=json.loads(p.filter_tags_json or "[]"),
        image=p.image,
        isNew=p.is_new,
        discountPercent=p.discount_percent,
        popularity=p.popularity,
    )


def user_to_out(u: User) -> UserOut:
    return UserOut(
        id=u.id,
        fullName=u.full_name,
        phone=u.phone,
        email=u.email,
        avatar=u.avatar,
    )
