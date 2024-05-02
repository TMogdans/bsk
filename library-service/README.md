# Library Service

This is a library service that holds board game data.

## Setup

## Commands

### Migrate Database

```bash
    typeorm migration:run -d src/data-source.ts
```

### Start Service

```bash
    npm run start
```

### Build Service

```bash
    npm run build
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
  name: library-service-db-password
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
