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

## Messages

Subscribed to channel `ratings`
and listens for the following messages:

### `createNewRating`

```json
{
  "meta": {
    "producer": "frontend",
    "version": "1.0.0"
  },
  "payload": {
    "object_id": "87ffd110-f249-43ca-9a04-36a106bc52fa",
    "user_id": "9bd70fdb-65af-47b0-acd5-d854818ce7ba",
    "material_quality": 7,
    "layout": 8,
    "complexity": 4,
    "difficulty": 4,
    "fun": 10,
    "variety": 4,
    "replayability": 6
  }
}

```

### `updateRating`

```json
{
  "meta": {
    "producer": "frontend",
    "version": "1.0.0"
  },
  "payload": {
    "object_id": "87ffd110-f249-43ca-9a04-36a106bc52fa",
    "user_id": "9bd70fdb-65af-47b0-acd5-d854818ce7ba",
    "material_quality": 7,
    "layout": 8,
    "complexity": 4,
    "difficulty": 4,
    "fun": 10,
    "variety": 4,
    "replayability": 6
  }
}

```
