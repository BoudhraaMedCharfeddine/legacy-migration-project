# microservices-infra

Kubernetes manifests for deploying the `modular-monolyth-to-microservices` project.

## Structure

```
microservices-infra/
├── kustomization.yaml           # Apply everything in one command
├── namespace.yaml
├── configmap.yaml               # RABBITMQ_URL, DATABASE_PATH, PORT
├── sqlite/
│   ├── persistent-volume.yaml   # hostPath PV (local dev)
│   └── persistent-volume-claim.yaml
├── rabbitmq/
│   ├── deployment.yaml
│   └── service.yaml             # ClusterIP — amqp:5672, management:15672
├── api-gateway/
│   ├── deployment.yaml
│   └── service.yaml             # NodePort 30000 → 3000
├── users-service/
│   └── deployment.yaml
├── categories-service/
│   └── deployment.yaml
├── products-service/
│   └── deployment.yaml
├── orders-service/
│   └── deployment.yaml
└── payments-service/
    └── deployment.yaml
```

## Architecture in the cluster

```
                  NodePort :30000
External traffic ──────────────────► api-gateway pod
                                          │
                                   ClusterIP :5672
                                          ▼
                                      rabbitmq pod
                                          │
                   ┌──────────────────────┼───────────────────────┐
                   ▼          ▼           ▼          ▼            ▼
             users-svc  categories  products-svc  orders-svc  payments-svc
                   │          │           │          │            │
                   └──────────┴───────────┴──────────┴────────────┘
                                          │
                                   PVC (sqlite-pvc)
                                   /data/data.db
```

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) (or any K8s cluster)
- Docker images built locally (see below)

---

## Deployment

### 1. Start Minikube

```bash
minikube start
```

### 2. Build images inside Minikube's Docker daemon

Point your local Docker CLI to Minikube's daemon so images are available without a registry:

```bash
eval $(minikube docker-env)
```

Then build all images from the monorepo root:

```bash
cd ../modular-monolyth-to-microservices

docker build -f apps/api-gateway/Dockerfile        -t api-gateway:latest        .
docker build -f apps/users-service/Dockerfile      -t users-service:latest      .
docker build -f apps/categories-service/Dockerfile -t categories-service:latest .
docker build -f apps/products-service/Dockerfile   -t products-service:latest   .
docker build -f apps/orders-service/Dockerfile     -t orders-service:latest     .
docker build -f apps/payments-service/Dockerfile   -t payments-service:latest   .
```

### 3. Populate the SQLite database on the Minikube node

The services reuse the existing SQLite database from the legacy Symfony project. Mount the directory into the Minikube node (keep this terminal open):

```bash
# from the repo root
minikube mount ./legacy-symfony/var:/data/legacy-sqlite
```

> The PersistentVolume maps `/data/legacy-sqlite` on the node to `/data` inside each pod.
> The ConfigMap sets `DATABASE_PATH=/data/data.db` — make sure `data.db` is the filename inside `legacy-symfony/var/`.

### 4. Apply all manifests

```bash
cd ../microservices-infra
kubectl apply -k .
```

Or apply step by step:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f sqlite/
kubectl apply -f rabbitmq/
kubectl apply -f api-gateway/
kubectl apply -f users-service/
kubectl apply -f categories-service/
kubectl apply -f products-service/
kubectl apply -f orders-service/
kubectl apply -f payments-service/
```

---

## Verify the deployment

```bash
# Watch all pods come up
kubectl get pods -n microservices -w

# Check all services
kubectl get svc -n microservices
```

Expected output once healthy:

```
NAME                  READY   STATUS    RESTARTS
api-gateway-xxx       1/1     Running   0
categories-service-x  1/1     Running   0
orders-service-xxx    1/1     Running   0
payments-service-xxx  1/1     Running   0
products-service-xxx  1/1     Running   0
rabbitmq-xxx          1/1     Running   0
users-service-xxx     1/1     Running   0
```

## Access the API

```bash
# Get the Minikube IP
minikube ip
# → e.g. 192.168.49.2

# The API is available at http://<minikube-ip>:30000/api
curl http://$(minikube ip):30000/api/users
```

Or use the Minikube service shortcut:

```bash
minikube service api-gateway -n microservices --url
```

## RabbitMQ management UI

Forward the management port to your local machine:

```bash
kubectl port-forward svc/rabbitmq 15672:15672 -n microservices
# → http://localhost:15672  (guest / guest)
```

---

## Teardown

```bash
kubectl delete -k .
minikube stop
```

---

## Design notes

### Why `replicas: 1` on all microservices

All services share the same SQLite file via a PVC. SQLite supports only one writer at a time (WAL mode allows concurrent reads). Scaling beyond 1 replica per service would cause write conflicts. The natural next step is to give each service its own database (PostgreSQL, MySQL) and remove this constraint.

### Why `imagePullPolicy: Never`

Images are built directly into Minikube's Docker daemon (`eval $(minikube docker-env)`), so Kubernetes should never try to pull them from a remote registry. Change this to `Always` or `IfNotPresent` when images are pushed to a container registry.

### Probes

- **api-gateway**: `tcpSocket` on port 3000 — confirms the HTTP server is accepting connections.
- **microservices**: no HTTP port exposed (they connect outbound to RabbitMQ). Add a `/health` NestJS endpoint + `httpGet` probe when moving to production.

### Production checklist

- [ ] Replace the `hostPath` PV with a cloud storage class supporting `ReadWriteMany` (AWS EFS, Azure File, NFS)
- [ ] Give each microservice its own database (PostgreSQL recommended) and remove the shared PVC
- [ ] Move RabbitMQ credentials to a `Secret` instead of the ConfigMap
- [ ] Replace the `NodePort` service with an `Ingress` controller (nginx, Traefik)
- [ ] Change `imagePullPolicy: Never` to `IfNotPresent` and push images to a container registry
- [ ] Add `httpGet` liveness/readiness probes to each microservice (requires a `/health` endpoint)
- [ ] Use a RabbitMQ `StatefulSet` with a PVC for message durability across restarts
