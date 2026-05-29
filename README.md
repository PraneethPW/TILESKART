# TilesKart

Professional full-stack ecommerce web app for tiles, marbles, and Indian-market flooring products.

## Stack

- Frontend: React, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, Zustand
- Backend: Node.js, Express, TypeScript, Prisma ORM
- Database: Neon Postgres
- AI: OpenRouter-compatible chat API
- Payments: Dummy demo payment flow

## Folder Structure

```txt
TilesKart/
  backend/
  frontend/
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Add your Neon connection string and OpenRouter key in `backend/.env`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Notes

- The frontend has fallback product data, so it still works before the database is connected.
- Login/signup and order creation use the backend when available. If the backend is offline, the UI uses a demo session so the ecommerce flow remains testable.
- Dummy payment marks the order as paid demo and does not call Stripe, Razorpay, or any payment gateway.
