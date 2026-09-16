# FoodUZ Backend

FastAPI backend for the FoodUZ food-delivery frontend.

## Stack

- FastAPI + Uvicorn
- SQLAlchemy 2.0 (SQLite by default, switch to PostgreSQL via `DATABASE_URL`)
- JWT auth (register / login)
- Seed script for initial data (replace with real CMS/admin later)

## Quick start

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # or: cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs  
Health: http://localhost:8000/api/health

Demo user after seed:
- phone: `+998901112233`
- password: `password123`

## Main endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | Home / categories page |
| GET | `/api/restaurants` | Catalog (`?category=&q=&free_delivery=`) |
| GET | `/api/restaurants/{id}` | Restaurant detail |
| GET | `/api/restaurants/{id}/menu` | Menu dishes |
| GET | `/api/promotions` | Promotions |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | My orders (auth) |
| GET/POST/DELETE | `/api/favorites` | Favorites (auth) |

## Switch to PostgreSQL

In `.env`:

```
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/fooduz
```

Install driver: `pip install psycopg[binary]`

## Re-seed

```bash
python -c "from app.seed import seed; seed(reset=True)"
```
