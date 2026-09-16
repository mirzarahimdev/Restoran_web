from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.routers import auth, categories, dishes, orders, promotions, restaurants
from app.seed import seed

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed(reset=False)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="FoodUZ delivery API — ready for real DB data via seed/admin.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(restaurants.router, prefix="/api")
app.include_router(dishes.router, prefix="/api")
app.include_router(promotions.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}
