# Rating Write Service

This is a simple rating service that allows users to rate an object.

## Setup

## Commands

### Migrate Database

```bash
    npx prisma migrate dev
```

### Reset Database

```bash
    npx prisma migrate reset
```

### Seed Database

```bash
    npx prisma db seed
```

### Start Service

```bash
    npm run start
```

### Compile Protobuf Messages

```bash
    protoc \
    --plugin=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=./src/generated \
    --proto_path=../../protobuf/rating-service/ \
    ../../protobuf/rating-service/rating-created.proto
```

### Kubernetes Secrets

Add secrets for the database and the service a connection string:

Example:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: rating-write-service-db-password|rating-write-service-db-url
  namespace: bsk
type: Opaque
data:
  password: sOmEbAsE64EnCoDeDpAsSwOrD
```

Use kubeseal to encrypt the secret:

```bash
    kubeseal -f secret.yaml -w sealed-secret.yaml --controller-name sealed-secrets --controller-namespace default
```

Upload the sealed secret to the cluster:

```bash
    kubectl apply -f sealed-secret.yaml
```
