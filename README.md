# Slab: Phone Shop (iPhone & Samsung)

React (Vite) + FastAPI + MySQL 8, containerized with Docker Compose.

## Run
```bash
cp .env.example .env      # edit secrets if you like
docker compose up --build
```
- Shop:      http://localhost:3000
- API docs:  http://localhost:8000/docs
- Admin:     admin@shop.com / admin123 (change it before deploying)

The backend creates tables and seeds 11 phones and the admin user on first start.
Nginx in the frontend container proxies `/api` to the backend, so the browser only talks to one origin.

## Features
Browse, filter by brand, search, product page, cart (saved in localStorage), JWT register/login,
checkout with stock check in a DB transaction, order history, admin add/delete phones.

## Local dev (without Docker for app code)
```bash
docker compose up db -d                       # MySQL only (add "ports: ['3306:3306']" to db first)
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev     # http://localhost:5173
```

## Layout
```
backend/app   main.py (routes) models.py schemas.py security.py seed.py database.py
frontend/src  App.jsx store.jsx api.js pages/ components/ styles.css
```
# iam_s3
