# Masterspace ERP

A full-stack ERP / document management system for **Masterspace Solutions Limited**
(_Tangible Solutions for Businesses_). It generates and manages the company's core
business documents — Invoices, Purchase Orders (LSO/LPO), Quotations, Delivery Notes,
Receipts and Work Orders — with branded, print-ready PDF layouts that match the
company's official templates.

---

## Tech Stack

| Layer      | Technology                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Backend    | NestJS 10 · Prisma ORM · PostgreSQL · JWT auth · class-validator       |
| Frontend   | React 18 · TypeScript · Vite · TailwindCSS · React Router · Axios      |
| Icons      | lucide-react                                                           |

The project is a monorepo with two independent apps:

```
masterspace-erp/
├── backend/     # NestJS REST API (port 3000, prefix /api)
└── frontend/    # React SPA (port 5173)
```

---

## Features

- **Authentication & roles** — JWT login with 5 roles: `ADMIN`, `FINANCE`, `SALES`,
  `PROCUREMENT`, `WAREHOUSE`. User management is Admin-only.
- **Six document modules**, each with list / create / edit / view / delete, status
  workflow, search and filtering:
  - **Invoice** (`INV`) — tax invoice with per-line VAT, totals & amount-in-words.
  - **Purchase Order** (`LSO`) — local service/purchase orders to suppliers.
  - **Quotation** (`QOT`) — client price quotations with tax.
  - **Delivery Note** (`POD`) — proof-of-delivery for dispatched goods.
  - **Receipt** (`RCT`) — payment receipts (optionally linked to an invoice).
  - **Work Order** (`WOR`) — site work orders with task assignments.
- **Clients & Suppliers** master data (CRUD).
- **Dashboard** with per-document counts and value totals.
- **Automatic document numbering** in the format `XXXNNNN-DDMMYY`
  (e.g. `INV0034-310826`). Counters are generated atomically per prefix.
- **Branded, print-ready document templates** — click **Download PDF** on any document
  to print/save it via the browser. Company details, KRA PIN and bank details are baked
  into every template.
- **Multi-currency** display (KES default, USD supported).

---

## Prerequisites

- Node.js 18+ and npm

---

## Getting Started

### 1. Backend (API)

```bash
cd backend
npm install
cp .env.example .env          # adjust JWT_SECRET / PORT if needed

npx prisma migrate deploy     # apply PostgreSQL migrations
npx prisma db seed            # seed users, counters, sample clients/suppliers

npm run start:dev             # dev server with watch → http://localhost:3000/api
```

The API is served under the `/api` prefix. Health check: `GET /api/health`.

### 2. Frontend (SPA)

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL defaults to http://localhost:3000/api

npm run dev                   # → http://localhost:5173
```

Open **http://localhost:5173** and sign in.

---

## Seeded Login Credentials

| Role    | Email                       | Password      |
| ------- | --------------------------- | ------------- |
| Admin   | admin@masterspace.co.ke     | `Admin@123`   |
| Finance | finance@masterspace.co.ke   | `Finance@123` |

The seed also creates sample clients (including *Ministry of Information Communication
Technology*), suppliers, and the document counters (Invoice counter starts at 33 so the
first invoice issued is `INV0034-…`).

The operational team accounts use the temporary password `Masterspace@2026` and must
change it on their first login. Bob Ochieng, James Mwita, Philip Adar, and Cornelius
Otieno are administrators.

---

## Available Scripts

### Backend

| Command                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run start:dev`     | Start API in watch mode                      |
| `npm run build`         | Compile to `dist/`                           |
| `npm run start:prod`    | Run the compiled build                       |
| `npx prisma studio`     | Browse the database in a GUI                 |
| `npx prisma db seed`    | Re-run the seed script                       |

### Frontend

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Vite dev server                      |
| `npm run build`     | Type-check + production build        |
| `npm run preview`   | Preview the production build         |

---

## API Overview

All routes are prefixed with `/api` and (except `POST /auth/login` and `GET /health`)
require a `Bearer` JWT.

| Method | Path                          | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/auth/login`                 | Authenticate, returns JWT       |
| GET    | `/auth/me`                    | Current user                    |
| POST   | `/auth/change-password`       | Change the authenticated user's password |
| GET    | `/dashboard/stats`            | Dashboard counts & totals       |
| CRUD   | `/invoices`                   | Invoices                        |
| CRUD   | `/purchase-orders`            | Purchase orders                 |
| CRUD   | `/quotations`                 | Quotations                      |
| CRUD   | `/delivery-notes`             | Delivery notes                  |
| CRUD   | `/receipts`                   | Receipts                        |
| CRUD   | `/work-orders`                | Work orders                     |
| CRUD   | `/clients`                    | Clients                         |
| CRUD   | `/suppliers`                  | Suppliers                       |
| CRUD   | `/users`                      | Users (Admin only)              |

Each document collection supports `?page=`, `?limit=`, `?search=` and `?status=`
query params on the list endpoint, plus `PATCH /:id/status` to change status.
Document numbers and monetary totals are computed **server-side** on create/update — the
client only submits the raw line items.

---

## Notes

- The database is **PostgreSQL**. Set `DATABASE_URL` to a valid `postgresql://` or
  `postgres://` connection string before running Prisma commands.
- Status and role fields are stored as strings and mirrored by TypeScript enums in
  `backend/src/common/enums.ts`.
