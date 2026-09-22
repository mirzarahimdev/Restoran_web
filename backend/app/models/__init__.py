from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    count_label: Mapped[str] = mapped_column(String(64), default="")
    restaurant_count: Mapped[int] = mapped_column(Integer, default=0)
    image: Mapped[str] = mapped_column(String(500))
    thumb: Mapped[str] = mapped_column(String(500), default="")
    description: Mapped[str] = mapped_column(String(500), default="")
    group: Mapped[str] = mapped_column(String(64), default="all")
    query_param: Mapped[str] = mapped_column(String(64), default="")
    badge: Mapped[str | None] = mapped_column(String(64), nullable=True)
    badge_tone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    popularity: Mapped[int] = mapped_column(Integer, default=0)
    popular: Mapped[bool] = mapped_column(Boolean, default=False)


class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    logo: Mapped[str] = mapped_column(String(500), default="")
    cover: Mapped[str] = mapped_column(String(500), default="")
    image: Mapped[str] = mapped_column(String(500))
    cuisine: Mapped[str] = mapped_column(String(200), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    rating: Mapped[float] = mapped_column(default=0.0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    reviews_label: Mapped[str] = mapped_column(String(32), default="0")
    eta: Mapped[str] = mapped_column(String(64), default="")
    delivery_time: Mapped[str] = mapped_column(String(64), default="")
    distance: Mapped[str] = mapped_column(String(32), default="")
    delivery_fee: Mapped[str] = mapped_column(String(64), default="")
    free_delivery: Mapped[bool] = mapped_column(Boolean, default=False)
    min_order: Mapped[str] = mapped_column(String(64), default="")
    min_order_amount: Mapped[int] = mapped_column(Integer, default=0)
    hours: Mapped[str] = mapped_column(String(64), default="10:00 - 23:00")
    address: Mapped[str] = mapped_column(String(300), default="")
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    open_now: Mapped[bool] = mapped_column(Boolean, default=True)
    accepting: Mapped[bool] = mapped_column(Boolean, default=True)
    price_tier: Mapped[int] = mapped_column(Integer, default=2)
    category_id: Mapped[str] = mapped_column(String(64), index=True)
    delivery_minutes: Mapped[int] = mapped_column(Integer, default=35)
    tags_json: Mapped[str] = mapped_column(Text, default="[]")
    badges_json: Mapped[str] = mapped_column(Text, default="[]")

    dishes: Mapped[list["MenuItem"]] = relationship(
        back_populates="restaurant",
        cascade="all, delete-orphan",
    )


class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    restaurant_id: Mapped[str] = mapped_column(ForeignKey("restaurants.id"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[int] = mapped_column(Integer)
    image: Mapped[str] = mapped_column(String(500), default="")
    badge: Mapped[str | None] = mapped_column(String(120), nullable=True)
    weight: Mapped[str | None] = mapped_column(String(64), nullable=True)
    category: Mapped[str] = mapped_column(String(64), default="all")
    popular: Mapped[bool] = mapped_column(Boolean, default=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    ingredients_json: Mapped[str] = mapped_column(Text, default="[]")

    restaurant: Mapped["Restaurant"] = relationship(back_populates="dishes")


class Promotion(Base):
    __tablename__ = "promotions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    restaurant_id: Mapped[str] = mapped_column(String(64), index=True)
    name: Mapped[str] = mapped_column(String(200))
    cuisine: Mapped[str] = mapped_column(String(200), default="")
    rating: Mapped[float] = mapped_column(default=0.0)
    reviews: Mapped[str] = mapped_column(String(32), default="0")
    eta: Mapped[str] = mapped_column(String(64), default="")
    price: Mapped[str] = mapped_column(String(64), default="")
    old_price: Mapped[str] = mapped_column(String(64), default="")
    delivery: Mapped[str] = mapped_column(String(64), default="")
    free_delivery: Mapped[bool] = mapped_column(Boolean, default=False)
    badge: Mapped[str] = mapped_column(String(64), default="")
    badge_tone: Mapped[str] = mapped_column(String(32), default="orange")
    filter_tags_json: Mapped[str] = mapped_column(Text, default="[]")
    image: Mapped[str] = mapped_column(String(500), default="")
    is_new: Mapped[bool] = mapped_column(Boolean, default=False)
    discount_percent: Mapped[int | None] = mapped_column(Integer, nullable=True)
    popularity: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(200))
    username: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)
    phone: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(200), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    google_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)
    avatar: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True)
    restaurant_id: Mapped[str] = mapped_column(String(64), index=True)


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    restaurant_id: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(32), default="pending")
    recipient_name: Mapped[str] = mapped_column(String(200), default="")
    recipient_phone: Mapped[str] = mapped_column(String(32), default="")
    address: Mapped[str] = mapped_column(String(400), default="")
    payment_method: Mapped[str] = mapped_column(String(64), default="cash")
    comment: Mapped[str] = mapped_column(Text, default="")
    food_total: Mapped[int] = mapped_column(Integer, default=0)
    delivery_fee: Mapped[int] = mapped_column(Integer, default=0)
    service_fee: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer, default=0)
    items_json: Mapped[str] = mapped_column(Text, default="[]")
