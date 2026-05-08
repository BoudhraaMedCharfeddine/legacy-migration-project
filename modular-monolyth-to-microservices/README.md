# Modular Monolith → Microservices

NestJS monorepo where each domain is an independent microservice. Services communicate through **RabbitMQ** (request-response via `@MessagePattern`, fire-and-forget via `@EventPattern`). A single **API Gateway** exposes the HTTP surface and proxies calls to the appropriate service.

## Architecture

```
                        ┌─────────────────────────────────────────────┐
HTTP clients            │              API Gateway (:3000)            │
────────────>  /api/*   │  UsersCtrl  CategoriesCtrl  ProductsCtrl    │
                        │  OrdersCtrl  PaymentsCtrl                   │
                        └────────────────────┬────────────────────────┘
                                             │ ClientProxy.send() / .emit()
                                    ┌────────▼────────┐
                                    │    RabbitMQ      │
                                    │  (5 queues)      │
                                    └──┬──┬──┬──┬──┬──┘
                                       │  │  │  │  │
                   ┌───────────────────┘  │  │  │  └──────────────────┐
                   │           ┌──────────┘  └──────────┐             │
                   ▼           ▼                         ▼             ▼
             users-svc  categories-svc  products-svc  orders-svc  payments-svc
```

### Services and queues

| Service | Queue | Responsibility |
|---------|-------|----------------|
| `users-service` | `users_queue` | CRUD on users |
| `categories-service` | `categories_queue` | CRUD on categories |
| `products-service` | `products_queue` | CRUD on products |
| `orders-service` | `orders_queue` | CRUD on orders + react to payment events |
| `payments-service` | `payments_queue` | CRUD on payments + emit `payment.created` |
| `api-gateway` | — | HTTP façade, routes requests to services |

### Cross-service event flow

```
POST /api/payments
  └─ api-gateway  →  payments_queue  →  payments-service
       └─ creates payment, then emits payment.created (fire-and-forget)
            └─ orders_queue  →  orders-service
                 └─ updates order status based on payment status
```

Payment status → order status mapping:

| Payment status | Order status |
|----------------|--------------|
| `completed` | `paid` |
| `failed` | `payment_failed` |
| `pending` | `awaiting_payment` |

---

## Project structure

```
modular-monolyth-to-microservices/
├── apps/
│   ├── api-gateway/          # HTTP entry point
│   │   └── src/
│   │       ├── modules/      # One module per domain (users, categories, ...)
│   │       └── filters/      # RpcExceptionFilter — converts RpcException → HTTP
│   ├── users-service/
│   ├── categories-service/
│   ├── products-service/
│   ├── orders-service/
│   └── payments-service/
├── libs/
│   └── shared/               # Shared constants, DTOs, message patterns
│       └── src/
│           ├── constants.ts  # QUEUES, MSG, EVT, service tokens
│           └── dto/          # CreateUserDto, UpdateOrderDto, ...
├── docker-compose.yml        # RabbitMQ infrastructure
└── .env                      # RABBITMQ_URL, DATABASE_PATH, PORT
```

---

## Shared library (`@app/shared`)

All inter-service contracts live in `libs/shared/`:

```typescript
// Service injection tokens
USERS_SERVICE, CATEGORIES_SERVICE, PRODUCTS_SERVICE, ORDERS_SERVICE, PAYMENTS_SERVICE

// Message patterns (request-response)
MSG.USERS_FIND_ALL      // { cmd: 'users_find_all' }
MSG.ORDERS_CREATE       // { cmd: 'orders_create' }
// ... 25 patterns total (CRUD × 5 services)

// Event patterns (fire-and-forget)
EVT.PAYMENT_CREATED     // 'payment.created'

// Queue names
QUEUES.USERS            // 'users_queue'
QUEUES.ORDERS           // 'orders_queue'
// ...
```

---

## Prerequisites

- Node.js 20+
- Docker (for RabbitMQ)
- The legacy SQLite database at `../legacy-symfony/var/data.db`

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

`.env` (already present at project root):

```env
PORT=3000
RABBITMQ_URL=amqp://guest:guest@localhost:5672
DATABASE_PATH=../legacy-symfony/var/data.db
```

### 3. Start RabbitMQ

```bash
docker compose up -d
```

RabbitMQ management UI: [http://localhost:15672](http://localhost:15672) — credentials: `guest / guest`

---

## Running the services

### Development mode (with file watching)

Open 6 terminals or use a process manager:

```bash
npm run dev:gateway
npm run dev:users
npm run dev:categories
npm run dev:products
npm run dev:orders
npm run dev:payments
```

### Production mode (build first)

```bash
npm run build:all

npm run start:gateway
npm run start:users
npm run start:categories
npm run start:products
npm run start:orders
npm run start:payments
```

---

## API reference

All endpoints are prefixed with `/api`. The gateway validates request bodies via class-validator DTOs and converts RPC errors to proper HTTP status codes.

### Users — `/api/users`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a user |
| GET | `/api/users/:id` | Get a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Categories — `/api/categories`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a category |
| GET | `/api/categories/:id` | Get a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Products — `/api/products`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create a product |
| GET | `/api/products/:id` | Get a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

**Create product body:**
```json
{ "name": "T-shirt", "price": 29.99, "user_id": 1, "category_id": 2 }
```

### Orders — `/api/orders`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/:id` | Get an order |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order |

### Payments — `/api/payments`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/payments` | List all payments |
| POST | `/api/payments` | Create a payment (triggers order status update) |
| GET | `/api/payments/:id` | Get a payment |
| PUT | `/api/payments/:id` | Update a payment |
| DELETE | `/api/payments/:id` | Delete a payment |

**Create payment body:**
```json
{ "amount": 59.99, "status": "completed", "order_id": 1 }
```

---

## Design notes

### No cross-service TypeORM relations

Each service owns only its own table. Foreign keys are plain `number` columns — TypeORM does not declare relations across service boundaries. This avoids implicit joins and tight coupling between databases.

```typescript
// products-service entity — userId is just a column, not a @ManyToOne relation
@Column({ name: 'user_id', nullable: true }) userId: number | null;
```

### Error propagation

Microservices throw `RpcException` with a structured payload:

```typescript
throw new RpcException({ statusCode: 404, message: 'User not found' });
```

The `RpcExceptionFilter` in the gateway converts this to the appropriate HTTP response.

### SQLite concurrency

All services share the same SQLite file (same as the legacy project). WAL journal mode is enabled via `prepareDatabase: (db) => db.pragma('journal_mode = WAL')` to allow concurrent reads and serialized writes.
