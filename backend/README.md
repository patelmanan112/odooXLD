# Wanderly / GlobeTrotter Backend API

Node.js + Express + Prisma ORM + PostgreSQL backend microservice for the Wanderly travel planning platform.

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the following variables are set in `backend/.env`:
- `DATABASE_URL`: PostgreSQL connection string (e.g. Aiven Cloud PostgreSQL URL)
- `JWT_SECRET`: Secret key for signing JSON Web Tokens
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Allowed CORS origin (default: `http://localhost:5173`)

### 3. Database Migration & Prisma Client
To format, validate, apply migrations, and generate Prisma Client:
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Running Server
- **Development Mode**: `npm run dev`
- **Production Mode**: `npm start`

---

## 📡 Implemented API Endpoints

### 🟢 Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server status check | No |

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user & return JWT | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |

### 🧳 Trip Management (CRUD)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips` | Create new trip for authenticated user | Yes |
| `GET` | `/api/trips` | Retrieve user's trips | Yes |
| `GET` | `/api/trips/:id` | Full nested itinerary details | Yes |
| `PUT` | `/api/trips/:id` | Update trip title, description, or dates | Yes |
| `DELETE` | `/api/trips/:id` | Delete trip & cascade stops/activities | Yes |

### 🌆 Cities (Read-Only)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cities` | List cities (optional `?search=...`) | No |

### 🎭 Activities (Read-Only)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/activities` | List activities (optional `?cityId=` & `?search=`) | No |

---

## 🤝 Teammate-Owned APIs (Intentionally Omitted)
The following routes are intentionally **not** implemented in this module as they belong to another teammate's assigned domain:
- `POST /api/trips/:id/stops`
- `DELETE /api/trips/:id/stops/:stopId`
- `PUT/PATCH /api/trips/:id/stops/reorder`
- `POST /api/trip-stops/:stopId/activities`
- `DELETE /api/trip-stops/:stopId/activities/:activityId`
- `GET /api/trips/:id/budget`

The shared Prisma schema (`backend/prisma/schema.prisma`) fully supports these endpoints through the `User`, `Trip`, `City`, `Activity`, `TripStop`, and `TripActivity` models and relations.

---

## 🗄️ Database Architecture & Shared Schema

```
User (1) ---- (*) Trip (1) ---- (*) TripStop (*) ---- (1) City (1) ---- (*) Activity
                                     |                                       |
                                     (*) ---------- TripActivity ----------- (*)
```

### Models Included
1. **User**: `id`, `name`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`
2. **Trip**: `id`, `userId`, `title`, `description`, `startDate`, `endDate`, `createdAt`, `updatedAt`
3. **City**: `id`, `name`, `country`, `description`, `imageUrl`, `createdAt`, `updatedAt`
4. **Activity**: `id`, `cityId`, `name`, `description`, `category`, `estimatedCost` (Decimal 10,2), `duration`, `imageUrl`, `createdAt`, `updatedAt`
5. **TripStop**: `id`, `tripId`, `cityId`, `startDate`, `endDate`, `stopOrder` (Int), `createdAt`, `updatedAt`
6. **TripActivity**: `id`, `tripStopId`, `activityId`, `date`, `createdAt`, `updatedAt` (with `@@unique([tripStopId, activityId])`)
