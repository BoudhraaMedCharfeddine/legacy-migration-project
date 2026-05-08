# Legacy Migration Project

A step-by-step migration of a legacy Symfony monolithic API toward a microservices architecture using NestJS.

## Migration Roadmap

```
legacy-symfony                   →   legacy-modular-monolyth          →   modular-monolyth-to-microservices
(PHP / Symfony monolith)             (NestJS modular monolith)             (NestJS microservices + RabbitMQ)
```

| Phase | Directory | Description |
|-------|-----------|-------------|
| 1 | `legacy-symfony/` | Original Symfony API with SQLite database |
| 2 | `legacy-modular-monolyth/` | NestJS rewrite, same DB, modules decoupled via domain events |
| 3 | `modular-monolyth-to-microservices/` | Each module becomes an independent microservice communicating via RabbitMQ |

---

## Phase 1 — Legacy Symfony API (`legacy-symfony/`)

The original monolith. Manages users, categories, products, orders, and payments through tightly-coupled controllers and Doctrine entities sharing a single SQLite database at `var/data.db`.

---

## Phase 2 — NestJS Modular Monolith (`legacy-modular-monolyth/`)

A NestJS application that migrates the business logic while **reusing the existing SQLite database** (`synchronize: false`).

### Key design decisions

- **No schema changes** — TypeORM entities map directly to existing table/column names (`@Entity('users')`, `@JoinColumn({ name: 'user_id' })`, etc.)
- **Cross-module decoupling via domain events** — modules never inject each other's repositories; instead they emit events through `@nestjs/event-emitter`
- **Entity reference pattern** — foreign key associations are expressed as `{ id: dto.user_id } as User` instead of injecting a `UserRepository` into another module

### Event flow

```
PaymentsService.create()
  └─ emits PaymentCreatedEvent
       └─ PaymentCreatedListener (OrdersModule)
            └─ updates order status
```

Status mapping: `completed → paid` | `failed → payment_failed` | `pending → awaiting_payment`

### Run

```bash
cd legacy-modular-monolyth
cp .env.example .env   # set DATABASE_PATH=../legacy-symfony/var/data.db
npm install
npm run start:dev
# API available at http://localhost:3000/api
```

---

## Phase 3 — Microservices + RabbitMQ (`modular-monolyth-to-microservices/`)

Each module from the modular monolith is extracted into its own NestJS microservice. Services communicate asynchronously through RabbitMQ.

See the full documentation: [modular-monolyth-to-microservices/README.md](modular-monolyth-to-microservices/README.md)
