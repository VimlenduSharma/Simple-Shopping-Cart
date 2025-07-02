# Shopping Cart Backend

This is the Node.js + Express + Prisma backend for the **Simple Shopping Cart** project. It provides a RESTful API supporting:

- **Authentication** (JWT via cookie or Bearer)
- **User** profile management
- **Category** listing (and admin CRUD)
- **Product** catalog (filtering, pagination, admin CRUD)
- **Shopping Cart** (add/view/update/remove/clear)
- **Checkout & Orders** (place order, order history, order detail)
- **OpenAPI docs** (Swagger)
- **Unit tests** with Vitest  
- **Database migrations & seed** with Prisma  
- **Docker** / `docker-compose` support  

---

## 📦 Tech Stack

- **Node.js 18** (Alpine)
- **TypeScript** (strict mode)
- **Express**  
- **Prisma** ORM (MySQL)
- **Zod** for request validation
- **Passport-JWT** for auth
- **Pino** for logging
- **Vitest** for unit tests
- **Swagger / OpenAPI** spec (`src/docs/openapi.yaml`)
- **Docker** & **Docker Compose**

---

## 🚀 Quickstart

### 1. Clone & install

```bash
git clone <your-repo-url>
cd backend
npm install

2. Environment

Create a file backend/.env (see below) and fill in real values:

3. Code Structure

backend/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/…
│  └─ seed.ts
├─ src/
│  ├─ config/
│  │  ├─ env.ts
│  │  ├─ db.ts
│  │  └─ logger.ts
│  ├─ docs/
│  │  └─ openapi.yaml
│  ├─ middlewares/
│  │  ├─ auth.middleware.ts
│  │  ├─ error.middleware.ts
│  │  └─ validate.middleware.ts
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ user/
│  │  ├─ category/
│  │  ├─ product/
│  │  ├─ cart/
│  │  └─ order/
│  ├─ utils/
│  │  ├─ apiError.ts
│  │  ├─ apiResponse.ts
│  │  ├─ pagination.ts
│  │  └─ slugify.ts
│  ├─ tests/
│  │  └─ product.test.ts
│  ├─ app.ts
│  └─ server.ts
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
└─ tsconfig.json

