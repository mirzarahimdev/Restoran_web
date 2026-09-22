from pydantic import BaseModel, EmailStr, Field


class CategoryOut(BaseModel):
    id: str
    name: str
    count: str
    image: str
    thumb: str = ""
    description: str = ""
    group: str = "all"
    queryParam: str = ""
    badge: str | None = None
    badgeTone: str | None = None
    restaurantCount: int = 0
    popularity: int = 0
    popular: bool = False

    model_config = {"from_attributes": True}


class BadgeOut(BaseModel):
    label: str
    tone: str = "orange"


class RestaurantListItem(BaseModel):
    id: str
    name: str
    rating: float
    reviews: str
    eta: str
    distance: str
    delivery: str
    minOrder: str
    tags: list[str]
    badges: list[BadgeOut]
    image: str
    freeDelivery: bool
    open: bool
    priceTier: int
    category: str
    deliveryMinutes: int


class RestaurantDetailOut(BaseModel):
    id: str
    name: str
    logo: str
    cover: str
    verified: bool
    cuisine: str
    description: str
    rating: float
    reviews: str
    hours: str
    address: str
    deliveryTime: str
    deliveryFee: str
    freeDelivery: bool
    minOrder: str
    accepting: bool
    category: str
    tags: list[str] = []


class MenuDishOut(BaseModel):
    id: str
    name: str
    description: str
    price: int
    priceLabel: str
    image: str
    badge: str | None = None
    weight: str | None = None
    category: str
    popular: bool = False
    ingredients: list[str] = []


class MenuCategoryOut(BaseModel):
    id: str
    label: str


class PopularDishOut(BaseModel):
    id: str
    restaurantId: str
    restaurant: str
    name: str
    description: str
    price: str
    priceAmount: int
    rating: float
    image: str
    tag: str | None = None


class FeaturedPromoOut(BaseModel):
    promotionId: str
    restaurantId: str
    tag: str
    title: str
    description: str
    cta: str
    image: str
    imageBadge: str
    secondsRemaining: int
    activePromoCount: int


class PromotionOut(BaseModel):
    id: str
    restaurantId: str
    name: str
    cuisine: str
    rating: float
    reviews: str
    eta: str
    price: str
    oldPrice: str
    delivery: str
    freeDelivery: bool
    badge: str
    badgeTone: str
    filterTags: list[str]
    image: str
    isNew: bool = False
    discountPercent: int | None = None
    popularity: int = 0


class UserOut(BaseModel):
    id: int
    fullName: str
    phone: str
    email: str | None = None
    avatar: str | None = None


class UserUpdateIn(BaseModel):
    fullName: str | None = Field(default=None, min_length=2, max_length=200)
    phone: str | None = Field(default=None, min_length=9, max_length=32)
    email: EmailStr | None = None
    avatar: str | None = Field(default=None, max_length=500)


class PasswordChangeIn(BaseModel):
    currentPassword: str = Field(min_length=6, max_length=128)
    newPassword: str = Field(min_length=6, max_length=128)


class RegisterIn(BaseModel):
    fullName: str = Field(min_length=2, max_length=200)
    phone: str = Field(min_length=9, max_length=32)
    email: EmailStr | None = None
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    login: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    password: str


class GoogleAuthIn(BaseModel):
    accessToken: str = Field(min_length=10)


class TokenOut(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: UserOut


class OrderItemIn(BaseModel):
    dishId: str
    name: str
    qty: int = Field(ge=1)
    price: int = Field(ge=0)
    image: str = ""


class OrderCreateIn(BaseModel):
    restaurantId: str
    items: list[OrderItemIn]
    recipientName: str
    recipientPhone: str
    address: str
    paymentMethod: str = "cash"
    comment: str = ""


class OrderOut(BaseModel):
    id: int
    restaurantId: str
    status: str
    foodTotal: int
    deliveryFee: int
    serviceFee: int
    total: int
    items: list[OrderItemIn]
    recipientName: str
    recipientPhone: str
    address: str
    paymentMethod: str


class FavoriteIn(BaseModel):
    restaurantId: str


class HealthOut(BaseModel):
    status: str
    app: str
