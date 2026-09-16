"""Seed database with initial FoodUZ demo data (replaceable by real admin CMS later)."""

from __future__ import annotations

import json

from app.database import Base, SessionLocal, engine
from app.models import Category, Favorite, MenuItem, Order, Promotion, Restaurant, User
from app.security import hash_password


CATEGORIES = [
    {
        "id": "milliy",
        "name": "Milliy taomlar",
        "count_label": "62+ joy",
        "restaurant_count": 62,
        "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&h=200&fit=crop",
        "description": "Osh, manti, somsa, shashlik va an’anaviy O‘zbek taomlari",
        "group": "milliy",
        "query_param": "milliy",
        "badge": "Mashhur",
        "badge_tone": "orange",
        "popularity": 100,
        "popular": True,
    },
    {
        "id": "pizza",
        "name": "Pizza",
        "count_label": "34+ joy",
        "restaurant_count": 34,
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
        "description": "Italyan pitsasi va yangi pishirilgan nonli taomlar",
        "group": "fastfood",
        "query_param": "pizza",
        "badge": "Chegirma",
        "badge_tone": "peach",
        "popularity": 94,
        "popular": True,
    },
    {
        "id": "fastfood",
        "name": "Fast Food",
        "count_label": "48+ joy",
        "restaurant_count": 48,
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop",
        "description": "Burger, fri va tezkor ovqatlanish",
        "group": "fastfood",
        "query_param": "fastfood",
        "badge": None,
        "badge_tone": None,
        "popularity": 90,
        "popular": True,
    },
    {
        "id": "sushi",
        "name": "Sushi & Roll",
        "count_label": "21+ joy",
        "restaurant_count": 21,
        "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop",
        "description": "Sushi, rollar va Osiyo taomlari",
        "group": "asia",
        "query_param": "sushi",
        "badge": None,
        "badge_tone": None,
        "popularity": 82,
        "popular": True,
    },
    {
        "id": "dessert",
        "name": "Shirinliklar",
        "count_label": "29+ joy",
        "restaurant_count": 29,
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop",
        "description": "Tortlar, desertlar va shirinliklar",
        "group": "dessert",
        "query_param": "dessert",
        "badge": None,
        "badge_tone": None,
        "popularity": 78,
        "popular": False,
    },
    {
        "id": "drinks",
        "name": "Ichimliklar",
        "count_label": "40+ joy",
        "restaurant_count": 40,
        "image": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&h=200&fit=crop",
        "description": "Sharbatlar, limonad va sovuq ichimliklar",
        "group": "all",
        "query_param": "drinks",
        "badge": None,
        "badge_tone": None,
        "popularity": 70,
        "popular": False,
    },
    {
        "id": "coffee",
        "name": "Qahvaxona",
        "count_label": "18+ joy",
        "restaurant_count": 18,
        "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
        "description": "Qahva, nonushta va desertlar",
        "group": "dessert",
        "query_param": "coffee",
        "badge": None,
        "badge_tone": None,
        "popularity": 66,
        "popular": False,
    },
    {
        "id": "healthy",
        "name": "Sog'lom ovqat",
        "count_label": "15+ joy",
        "restaurant_count": 15,
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&h=560&fit=crop",
        "thumb": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
        "description": "Salatlar va sog‘lom taomlar",
        "group": "all",
        "query_param": "healthy",
        "badge": "Fresh",
        "badge_tone": "green",
        "popularity": 60,
        "popular": False,
    },
]


RESTAURANTS = [
    {
        "id": "samarqand-osh",
        "name": "Samarqand Osh Markazi",
        "logo": "/images/samarqand-osh-logo.png",
        "cover": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=700&fit=crop",
        "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=500&fit=crop",
        "cuisine": "Milliy taomlar",
        "description": "Haqiqiy an'anaviy Samarqand to'y oshi va tandir go'shti",
        "rating": 4.9,
        "reviews_count": 1240,
        "reviews_label": "1,240",
        "eta": "25–35 daq",
        "delivery_time": "25–35 daqiqa",
        "distance": "1.8 km",
        "delivery_fee": "Bepul",
        "free_delivery": True,
        "min_order": "35,000 so'm",
        "min_order_amount": 35000,
        "hours": "10:00 - 23:00",
        "address": "Toshkent sh., Chilonzor 9-mavze, 12-uy",
        "verified": True,
        "open_now": True,
        "accepting": True,
        "price_tier": 1,
        "category_id": "milliy",
        "delivery_minutes": 35,
        "tags": ["Milliy taomlar", "Osh, Manti"],
        "badges": [
            {"label": "Top tanlov", "tone": "orange"},
            {"label": "-15% Aksiya", "tone": "peach"},
        ],
    },
    {
        "id": "bella-pizza",
        "name": "Bella Pizza Trattoria",
        "logo": "",
        "cover": "",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop",
        "cuisine": "Pitsa",
        "description": "Italiya uslubidagi pitsa va pasta",
        "rating": 4.8,
        "reviews_count": 890,
        "reviews_label": "890",
        "eta": "30–40 daq",
        "delivery_time": "30–40 daqiqa",
        "distance": "3.2 km",
        "delivery_fee": "8,000 so'm",
        "free_delivery": False,
        "min_order": "50,000 so'm",
        "min_order_amount": 50000,
        "hours": "10:00 - 23:00",
        "address": "Toshkent sh.",
        "verified": True,
        "open_now": True,
        "accepting": True,
        "price_tier": 2,
        "category_id": "pizza",
        "delivery_minutes": 40,
        "tags": ["Pitsa", "Italiya taomlari"],
        "badges": [{"label": "Top tanlov", "tone": "orange"}],
    },
    {
        "id": "burger-house",
        "name": "Burger House Artisan",
        "logo": "",
        "cover": "",
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop",
        "cuisine": "Fast Food",
        "description": "Artisan burgerlar va kombolar",
        "rating": 4.7,
        "reviews_count": 650,
        "reviews_label": "650",
        "eta": "20–30 daq",
        "delivery_time": "20–30 daqiqa",
        "distance": "2.1 km",
        "delivery_fee": "5,000 so'm",
        "free_delivery": False,
        "min_order": "40,000 so'm",
        "min_order_amount": 40000,
        "hours": "10:00 - 23:00",
        "address": "Toshkent sh.",
        "verified": False,
        "open_now": True,
        "accepting": True,
        "price_tier": 2,
        "category_id": "burger",
        "delivery_minutes": 30,
        "tags": ["Burger", "Fast Food"],
        "badges": [{"label": "Katta kombo", "tone": "peach"}],
    },
    {
        "id": "sushi-time",
        "name": "Sushi Time Tashkent",
        "logo": "",
        "cover": "",
        "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=500&fit=crop",
        "cuisine": "Sushi",
        "description": "Yangi sushi va rollar",
        "rating": 4.9,
        "reviews_count": 420,
        "reviews_label": "420",
        "eta": "35–45 daq",
        "delivery_time": "35–45 daqiqa",
        "distance": "3.7 km",
        "delivery_fee": "Bepul",
        "free_delivery": True,
        "min_order": "60,000 so'm",
        "min_order_amount": 60000,
        "hours": "11:00 - 23:00",
        "address": "Toshkent sh.",
        "verified": True,
        "open_now": True,
        "accepting": True,
        "price_tier": 3,
        "category_id": "sushi",
        "delivery_minutes": 45,
        "tags": ["Sushi", "Rollar, Osiyo"],
        "badges": [{"label": "Top tanlov", "tone": "orange"}],
    },
    {
        "id": "rayhon-milliy",
        "name": "Rayhon Milliy Taomlari",
        "logo": "",
        "cover": "",
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=500&fit=crop",
        "cuisine": "Milliy taomlar",
        "description": "Lag'mon, manti va shashlik",
        "rating": 4.6,
        "reviews_count": 980,
        "reviews_label": "980",
        "eta": "25–35 daq",
        "delivery_time": "25–35 daqiqa",
        "distance": "2.4 km",
        "delivery_fee": "7,000 so'm",
        "free_delivery": False,
        "min_order": "35,000 so'm",
        "min_order_amount": 35000,
        "hours": "09:00 - 22:00",
        "address": "Toshkent sh.",
        "verified": True,
        "open_now": True,
        "accepting": True,
        "price_tier": 1,
        "category_id": "milliy",
        "delivery_minutes": 35,
        "tags": ["Lag'mon, Manti", "Shashlik"],
        "badges": [{"label": "Issiq tandir", "tone": "orange"}],
    },
    {
        "id": "coffee-sweet",
        "name": "Coffee & Sweet Corner",
        "logo": "",
        "cover": "",
        "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop",
        "cuisine": "Shirinliklar",
        "description": "Qahva va desertlar",
        "rating": 4.8,
        "reviews_count": 310,
        "reviews_label": "310",
        "eta": "15–25 daq",
        "delivery_time": "15–25 daqiqa",
        "distance": "1.2 km",
        "delivery_fee": "Bepul",
        "free_delivery": True,
        "min_order": "25,000 so'm",
        "min_order_amount": 25000,
        "hours": "08:00 - 22:00",
        "address": "Toshkent sh.",
        "verified": False,
        "open_now": True,
        "accepting": True,
        "price_tier": 2,
        "category_id": "dessert",
        "delivery_minutes": 25,
        "tags": ["Desertlar", "Qahva, Nonushta"],
        "badges": [{"label": "Tez yetkazish", "tone": "green"}],
    },
]


MENU_SAMARQAND = [
    {
        "id": "toy-oshi",
        "name": "Samarqandcha To'y Oshi",
        "description": "Maxsus ziravorlar bilan tayyorlangan an'anaviy osh",
        "price": 48000,
        "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&h=400&fit=crop",
        "badge": "Eng ko‘p sotilgan",
        "weight": "380 gr",
        "category": "osh",
        "popular": True,
        "ingredients": [
            "Guruch (devzira)",
            "Qo‘y go‘shti",
            "Sabzi",
            "Piyoz",
            "No‘xat",
            "Mayiz",
            "Ziravorlar (zira, qalampir)",
            "O‘simlik yog‘i",
        ],
    },
    {
        "id": "tandir",
        "name": "Tandir Go'sht",
        "description": "Tandirda sekin pishirilgan yumshoq qo'y go'shti",
        "price": 75000,
        "image": "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=400&fit=crop",
        "badge": "Olovda pishgan",
        "weight": "320 gr",
        "category": "shashlik",
        "popular": True,
        "ingredients": [
            "Qo‘y go‘shti",
            "Piyoz",
            "Sarimsoq",
            "Zira",
            "Qora qalampir",
            "Tuz",
            "O‘simlik yog‘i",
        ],
    },
    {
        "id": "achichuk",
        "name": "Achichuk Salati",
        "description": "Yangi pomidor, piyoz va ko‘katlar bilan milliy salat",
        "price": 15000,
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        "badge": None,
        "weight": "180 gr",
        "category": "salad",
        "popular": True,
        "ingredients": [
            "Pomidor",
            "Piyoz",
            "Bodring",
            "Ko‘katlar (ukrop, petrushka)",
            "Tuz",
            "O‘simlik yog‘i",
        ],
    },
    {
        "id": "non",
        "name": "Samarqand Non (patir)",
        "description": "Issiq tandir noni, kunjut bilan",
        "price": 8000,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
        "badge": None,
        "weight": "1 dona",
        "category": "salad",
        "popular": True,
        "ingredients": [
            "Un",
            "Suv",
            "Xamir turishi",
            "Tuz",
            "Kunjut",
            "Sariyog‘",
        ],
    },
    {
        "id": "shashlik",
        "name": "Mol Go'sht Shashlik",
        "description": "Cho'g'da pishirilgan shirali shashlik",
        "price": 42000,
        "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
        "badge": None,
        "weight": "250 gr",
        "category": "shashlik",
        "popular": True,
        "ingredients": [
            "Mol go‘shti",
            "Piyoz",
            "Sirka",
            "Zira",
            "Qalampir",
            "Tuz",
            "O‘simlik yog‘i",
        ],
    },
    {
        "id": "choy",
        "name": "Ko'k choy limon va asal bilan",
        "description": "Yangi limon va asal bilan damlangan choy",
        "price": 12000,
        "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop",
        "badge": None,
        "weight": "1 litr",
        "category": "drinks",
        "popular": True,
        "ingredients": [
            "Ko‘k choy bargi",
            "Limon",
            "Asal",
            "Issiq suv",
            "Yalpiz (ixtiyoriy)",
        ],
    },
    {
        "id": "manti",
        "name": "Qo‘y go‘shtli manti",
        "description": "Bug‘da pishirilgan manti",
        "price": 38000,
        "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop",
        "badge": None,
        "weight": "6 dona",
        "category": "osh",
        "popular": False,
        "ingredients": [
            "Un",
            "Tuxum",
            "Qo‘y go‘shti",
            "Piyoz",
            "Tuz",
            "Qora qalampir",
            "Suv",
        ],
    },
    {
        "id": "halva",
        "name": "Samarqand halvasi",
        "description": "An’anaviy yong‘oqli haliwa",
        "price": 22000,
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
        "badge": None,
        "weight": "200 gr",
        "category": "dessert",
        "popular": False,
        "ingredients": [
            "Un",
            "Shakar",
            "Yong‘oq",
            "Sariyog‘",
            "Vanilin",
            "Asal",
        ],
    },
]


MENUS_BY_RESTAURANT: dict[str, list[dict]] = {
    "samarqand-osh": MENU_SAMARQAND,
    "bella-pizza": [
        {
            "id": "margherita",
            "name": "Margherita Pizza",
            "description": "Klassik pomidor sousi, mozzarella va rayhon",
            "price": 55000,
            "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
            "badge": "Eng ko‘p sotilgan",
            "weight": "32 sm",
            "category": "osh",
            "popular": True,
            "ingredients": ["Xamir", "Pomidor sousi", "Mozzarella", "Rayhon", "Zaytun yog‘i"],
        },
        {
            "id": "pepperoni",
            "name": "Pepperoni Pizza",
            "description": "Achchiq pepperoni va eritilgan pishloq",
            "price": 65000,
            "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "32 sm",
            "category": "osh",
            "popular": True,
            "ingredients": ["Xamir", "Pomidor sousi", "Mozzarella", "Pepperoni"],
        },
        {
            "id": "pasta-carbonara",
            "name": "Pasta Carbonara",
            "description": "Kremli sous, bekon va parmesan",
            "price": 48000,
            "image": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "350 gr",
            "category": "salad",
            "popular": True,
            "ingredients": ["Spaghetti", "Bekon", "Tuxum", "Parmesan", "Qora qalampir"],
        },
        {
            "id": "tiramisu",
            "name": "Tiramisu",
            "description": "Klassik italyan shirinligi",
            "price": 32000,
            "image": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "150 gr",
            "category": "dessert",
            "popular": False,
            "ingredients": ["Savoyardi", "Mascarpone", "Qahva", "Kakao"],
        },
    ],
    "burger-house": [
        {
            "id": "classic-burger",
            "name": "Classic Beef Burger",
            "description": "Mol go‘shti, salat, pomidor va sous",
            "price": 42000,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
            "badge": "Eng ko‘p sotilgan",
            "weight": "280 gr",
            "category": "osh",
            "popular": True,
            "ingredients": ["Bulochka", "Mol go‘shti", "Salat", "Pomidor", "Piyoz", "Sous"],
        },
        {
            "id": "cheese-burger",
            "name": "Double Cheese Burger",
            "description": "Ikki qavatli go‘sht va cheddar pishloq",
            "price": 52000,
            "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "320 gr",
            "category": "osh",
            "popular": True,
            "ingredients": ["Bulochka", "Mol go‘shti", "Cheddar", "Tuzlangan bodring", "Sous"],
        },
        {
            "id": "fries",
            "name": "Kartoshka fri",
            "description": "Oltin rangli qovurilgan fri",
            "price": 18000,
            "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e06497?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "150 gr",
            "category": "salad",
            "popular": True,
            "ingredients": ["Kartoshka", "Tuz", "O‘simlik yog‘i"],
        },
        {
            "id": "cola",
            "name": "Cola 0.5L",
            "description": "Sovuq gazli ichimlik",
            "price": 12000,
            "image": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "0.5 L",
            "category": "drinks",
            "popular": False,
            "ingredients": ["Gazli ichimlik"],
        },
    ],
    "sushi-time": [
        {
            "id": "philadelphia",
            "name": "Philadelphia Roll",
            "description": "Losos, krem-pishloq va avokado",
            "price": 58000,
            "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
            "badge": "Eng ko‘p sotilgan",
            "weight": "8 dona",
            "category": "osh",
            "popular": True,
            "ingredients": ["Guruch", "Nori", "Losos", "Krem-pishloq", "Avokado"],
        },
        {
            "id": "california",
            "name": "California Roll",
            "description": "Krab, avokado va bodring",
            "price": 45000,
            "image": "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "8 dona",
            "category": "osh",
            "popular": True,
            "ingredients": ["Guruch", "Nori", "Krab", "Avokado", "Bodring"],
        },
        {
            "id": "miso",
            "name": "Miso sho‘rva",
            "description": "An’anaviy yapon sho‘rvasi",
            "price": 22000,
            "image": "https://images.unsplash.com/photo-1547592166-23acba6245b5?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "300 ml",
            "category": "drinks",
            "popular": False,
            "ingredients": ["Miso pastasi", "Tofu", "Vakame", "Yashil piyoz"],
        },
    ],
    "rayhon-milliy": [
        {
            "id": "lagman",
            "name": "Lag‘mon",
            "description": "Qo‘lda tortilgan lag‘mon va sabzavotlar",
            "price": 38000,
            "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
            "badge": "Eng ko‘p sotilgan",
            "weight": "400 gr",
            "category": "osh",
            "popular": True,
            "ingredients": ["Lag‘mon", "Go‘sht", "Sabzi", "Piyoz", "Qalampir"],
        },
        {
            "id": "somsa",
            "name": "Go‘shtli somsa",
            "description": "Tandirda pishirilgan somsa",
            "price": 12000,
            "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "1 dona",
            "category": "salad",
            "popular": True,
            "ingredients": ["Un", "Go‘sht", "Piyoz", "Zira", "Tuz"],
        },
        {
            "id": "choy-qora",
            "name": "Qora choy",
            "description": "Issiq damlangan choy",
            "price": 8000,
            "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "1 choynak",
            "category": "drinks",
            "popular": False,
            "ingredients": ["Qora choy", "Issiq suv"],
        },
    ],
    "coffee-sweet": [
        {
            "id": "cappuccino",
            "name": "Cappuccino",
            "description": "Yumshoq sut ko‘pigi bilan",
            "price": 28000,
            "image": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop",
            "badge": "Eng ko‘p sotilgan",
            "weight": "250 ml",
            "category": "drinks",
            "popular": True,
            "ingredients": ["Espresso", "Sut", "Sut ko‘pigi"],
        },
        {
            "id": "cheesecake",
            "name": "Cheesecake",
            "description": "Yumshoq vanilli cheesecake",
            "price": 35000,
            "image": "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "140 gr",
            "category": "dessert",
            "popular": True,
            "ingredients": ["Tvorog", "Pechevo", "Sariyog‘", "Vanilin"],
        },
        {
            "id": "croissant",
            "name": "Croissant",
            "description": "Issiq sariyog‘li kruassan",
            "price": 18000,
            "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop",
            "badge": None,
            "weight": "1 dona",
            "category": "salad",
            "popular": False,
            "ingredients": ["Un", "Sariyog‘", "Xamir turishi", "Tuz"],
        },
    ],
}


PROMOTIONS = [
    {
        "id": "promo-samarqand",
        "restaurant_id": "samarqand-osh",
        "name": "Samarqand Osh Markazi",
        "cuisine": "Milliy taomlar · Osh, manti, somsa",
        "rating": 4.9,
        "reviews": "1,240",
        "eta": "30–40 daq",
        "price": "48,000",
        "old_price": "56,000",
        "delivery": "Bepul",
        "free_delivery": True,
        "badge": "-15%",
        "badge_tone": "orange",
        "filter_tags": ["all", "20", "free"],
        "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=500&fit=crop",
        "is_new": False,
        "discount_percent": 15,
        "popularity": 100,
    },
    {
        "id": "promo-pizza",
        "restaurant_id": "bella-pizza",
        "name": "Bella Pizza Trattoria",
        "cuisine": "Pitsa · Italiya",
        "rating": 4.8,
        "reviews": "890",
        "eta": "30–40 daq",
        "price": "65,000",
        "old_price": "85,000",
        "delivery": "8,000 so'm",
        "free_delivery": False,
        "badge": "-25%",
        "badge_tone": "red",
        "filter_tags": ["all", "20", "30"],
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop",
        "is_new": False,
        "discount_percent": 25,
        "popularity": 92,
    },
    {
        "id": "promo-burger",
        "restaurant_id": "burger-house",
        "name": "Burger House Artisan",
        "cuisine": "Burger · Combo",
        "rating": 4.7,
        "reviews": "650",
        "eta": "20–30 daq",
        "price": "55,000",
        "old_price": "70,000",
        "delivery": "5,000 so'm",
        "free_delivery": False,
        "badge": "Combo",
        "badge_tone": "peach",
        "filter_tags": ["all", "combo", "20"],
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop",
        "is_new": True,
        "discount_percent": 20,
        "popularity": 88,
    },
]


def ensure_menu_ingredients_column() -> None:
    from sqlalchemy import text

    with engine.begin() as conn:
        cols = {
            row[1]
            for row in conn.execute(text("PRAGMA table_info(menu_items)")).fetchall()
        }
        if "ingredients_json" not in cols:
            conn.execute(
                text("ALTER TABLE menu_items ADD COLUMN ingredients_json TEXT DEFAULT '[]'")
            )


def ensure_user_google_id_column() -> None:
    from sqlalchemy import text

    with engine.begin() as conn:
        cols = {
            row[1]
            for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()
        }
        if "google_id" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN google_id VARCHAR(64)"))


def seed(reset: bool = False) -> None:
    Base.metadata.create_all(bind=engine)
    ensure_menu_ingredients_column()
    ensure_user_google_id_column()
    db = SessionLocal()
    try:
        if reset:
            for table in reversed(Base.metadata.sorted_tables):
                db.execute(table.delete())
            db.commit()

        if db.query(Category).count() == 0:
            for row in CATEGORIES:
                db.add(Category(**row))

        if db.query(Restaurant).count() == 0:
            for row in RESTAURANTS:
                data = {**row}
                tags = data.pop("tags")
                badges = data.pop("badges")
                db.add(
                    Restaurant(
                        **data,
                        tags_json=json.dumps(tags, ensure_ascii=False),
                        badges_json=json.dumps(badges, ensure_ascii=False),
                    )
                )

        if db.query(MenuItem).count() == 0:
            for restaurant_id, rows in MENUS_BY_RESTAURANT.items():
                for row in rows:
                    data = {**row}
                    ingredients = data.pop("ingredients", [])
                    db.add(
                        MenuItem(
                            restaurant_id=restaurant_id,
                            available=True,
                            ingredients_json=json.dumps(ingredients, ensure_ascii=False),
                            **data,
                        )
                    )
        else:
            for restaurant_id, rows in MENUS_BY_RESTAURANT.items():
                for row in rows:
                    item = db.get(MenuItem, row["id"])
                    if not item:
                        data = {**row}
                        ingredients = data.pop("ingredients", [])
                        db.add(
                            MenuItem(
                                restaurant_id=restaurant_id,
                                available=True,
                                ingredients_json=json.dumps(ingredients, ensure_ascii=False),
                                **data,
                            )
                        )
                        continue
                    ingredients = row.get("ingredients") or []
                    current = json.loads(item.ingredients_json or "[]")
                    if not current:
                        item.ingredients_json = json.dumps(ingredients, ensure_ascii=False)

        if db.query(Promotion).count() == 0:
            for row in PROMOTIONS:
                data = {**row}
                tags = data.pop("filter_tags")
                db.add(
                    Promotion(
                        **data,
                        filter_tags_json=json.dumps(tags, ensure_ascii=False),
                        active=True,
                    )
                )

        demo_user = db.query(User).filter(User.phone == "+998901112233").first()
        demo_avatar = (
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
        )
        if not demo_user:
            demo_user = User(
                full_name="Aziza Karimova",
                phone="+998901112233",
                email="aziza@fooduz.uz",
                password_hash=hash_password("password123"),
                avatar=demo_avatar,
            )
            db.add(demo_user)
            db.flush()
        elif not demo_user.avatar:
            demo_user.avatar = demo_avatar
            db.add(demo_user)

        for rid in ("samarqand-osh", "bella-pizza", "rayhon-milliy"):
            if not db.get(Restaurant, rid):
                continue
            exists = (
                db.query(Favorite)
                .filter(Favorite.user_id == demo_user.id, Favorite.restaurant_id == rid)
                .first()
            )
            if not exists:
                db.add(Favorite(user_id=demo_user.id, restaurant_id=rid))

        demo_order_statuses = {"on_the_way", "delivered", "cancelled"}
        existing_status = {
            s
            for (s,) in db.query(Order.status)
            .filter(Order.user_id == demo_user.id)
            .distinct()
            .all()
        }
        if not demo_order_statuses.issubset(existing_status):
            demo_orders = [
                {
                    "restaurant_id": "samarqand-osh",
                    "status": "on_the_way",
                    "payment_method": "humo",
                    "address": "Mirzo Ulug'bek t., Buyuk Ipak Yo'li 42",
                    "food_total": 84000,
                    "delivery_fee": 0,
                    "service_fee": 8000,
                    "total": 92000,
                    "items": [
                        {
                            "dishId": "plov-1",
                            "name": "Samarqandcha To'y Oshi",
                            "qty": 1,
                            "price": 45000,
                            "image": "",
                        },
                        {
                            "dishId": "salad-1",
                            "name": "Achchiq-chuchuk",
                            "qty": 2,
                            "price": 12000,
                            "image": "",
                        },
                        {
                            "dishId": "drink-1",
                            "name": "Ayron 0.5L",
                            "qty": 2,
                            "price": 8000,
                            "image": "",
                        },
                    ],
                },
                {
                    "restaurant_id": "bella-pizza",
                    "status": "delivered",
                    "payment_method": "humo",
                    "address": "Mirzo Ulug'bek t., Buyuk Ipak Yo'li 42",
                    "food_total": 78000,
                    "delivery_fee": 0,
                    "service_fee": 7000,
                    "total": 85000,
                    "items": [
                        {
                            "dishId": "pepperoni",
                            "name": "Pepperoni pizza",
                            "qty": 1,
                            "price": 65000,
                            "image": "",
                        },
                        {
                            "dishId": "cola",
                            "name": "Coca-Cola 0.5L",
                            "qty": 2,
                            "price": 8000,
                            "image": "",
                        },
                    ],
                },
                {
                    "restaurant_id": "rayhon-milliy",
                    "status": "delivered",
                    "payment_method": "click",
                    "address": "Yunusobod t., Amir Temur 18",
                    "food_total": 52000,
                    "delivery_fee": 8000,
                    "service_fee": 5000,
                    "total": 65000,
                    "items": [
                        {
                            "dishId": "lagman-1",
                            "name": "Uy lag'mon",
                            "qty": 2,
                            "price": 28000,
                            "image": "",
                        },
                    ],
                },
                {
                    "restaurant_id": "samarqand-osh",
                    "status": "cancelled",
                    "payment_method": "cash",
                    "address": "Mirzo Ulug'bek t., Buyuk Ipak Yo'li 42",
                    "food_total": 45000,
                    "delivery_fee": 0,
                    "service_fee": 4000,
                    "total": 49000,
                    "items": [
                        {
                            "dishId": "plov-1",
                            "name": "Samarqandcha To'y Oshi",
                            "qty": 1,
                            "price": 45000,
                            "image": "",
                        },
                    ],
                },
            ]
            for row in demo_orders:
                if row["status"] in existing_status:
                    continue
                items = row.pop("items")
                db.add(
                    Order(
                        user_id=demo_user.id,
                        recipient_name=demo_user.full_name,
                        recipient_phone=demo_user.phone,
                        comment="",
                        items_json=json.dumps(items, ensure_ascii=False),
                        **row,
                    )
                )

        db.commit()
        print("Seed completed.")
    finally:
        db.close()


if __name__ == "__main__":
    seed(reset=False)
