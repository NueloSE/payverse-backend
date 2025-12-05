# PayVerse Backend — Core Payments Service

A high-performance, production-ready payments backend built for the **Software Engineering Weekly Challenge**.

**Tech Stack:** Node.js + TypeScript + Express + Prisma + PostgreSQL + JWT + Docker

## Chosen Technical Trade-Offs

| Options Considered        | Final Decisions     | Justification (Fintech Context)                                                                                      |
| ------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| REST vs gRPC              | **REST**            | Excellent browser support, Postman-friendly, easier debugging, sufficient throughput for payment APIs, team velocity |
| SQL vs NoSQL              | **SQL**             | Payments demand ACID compliance, complex reporting, strong consistency, relational integrity (sender ↔ receiver)     |
| JWT vs Session-Based Auth | **JWT (Stateless)** | Horizontal scaling, no session store needed, mobile-first, industry standard                                         |

## Features Implemented

- Register / Login with bcrypt hashing
- JWT-based stateless authentication
- Create payment (sender → receiver via email)
- List sent & received payments with summary
- Currency enum: **NGN / GHS / KES**
- Automatic status transition: PENDING → COMPLETED
- Clean error handling (no stack traces leaked)
- Dockerized PostgreSQL
- Full Postman collection included

## Quick Start (3 commands)

```bash
# 1. Clone and install
git clone https://github.com/nuelose/payverse-backend.git
cd payverse-backend
npm install
```

## 2. Start PostgreSQL + backend

```bash
docker-compose up -d    # starts DB
npm run dev             # starts server at http://localhost:3000
```

## 3. Run migrations

```bash
npx prisma migrate dev
npx prisma generate
```

## Api endpoints

[Postman documentation](https://documenter.getpostman.com/view/49262917/2sB3dPSqhS)
