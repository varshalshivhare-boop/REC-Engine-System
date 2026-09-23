# 🚀 REC-Engine-System

A high-performance, modular **Recommendation Engine** built with **Node.js (Fastify)**, **Qdrant** (Vector Database), **Redis** (Feature Store), **Kafka** (Event Streaming), and **JWT** Authentication.

---

## 🏛️ System Architecture

```
                    ┌─────────────────────────┐
                    │       User / Client     │
                    └───────────┬─────────────┘
                                │ GET /recommend?userId=u1
                                ▼
                    ┌─────────────────────────┐
                    │   Fastify HTTP Server   │
                    └───────────┬─────────────┘
                                │
               ┌────────────────┴────────────────┐
               │    5-Stage Pipeline Orchestrator │
               └────────────────┬────────────────┘
                                │
   ┌───────────┬────────────────┼───────────────┬────────────┐
   │           │                │               │            │
   ▼           ▼                ▼               ▼            ▼
[Stage 1]   [Stage 2]        [Stage 3]       [Stage 4]    [Stage 5]
 Vector      Feature            ML           Re-Ranking    Response
 Search    Enrichment         Scoring       (Rules/Boost)  Formatting
   │           │                │               │            │
   ▼           ▼                ▼               │            ▼
(Qdrant)    (Redis)        (mockScorer)         │         (Client)
                                                ▼
                                         (Filter Stock,
                                         Sponsored Boost)
```

### Real-Time Event Loop (Feedback Engine)

```
[User Clicks Item] ──► POST /track-click ──► [Kafka Producer]
                                                    │
                                                    ▼ (user-clicks topic)
                                             [Kafka Consumer]
                                                    │
                                                    ▼
                                          [Redis Feature Store]
                                          (Updates Click Counts & CTR)
```

---

## 🛠️ Tech Stack

- **Framework**: [Fastify](https://fastify.dev/) (High-performance HTTP server)
- **Vector Database**: [Qdrant](https://qdrant.tech/) (Nearest-neighbor search for semantic embeddings)
- **Feature Store**: [Redis](https://redis.io/) (Sub-millisecond item & user metadata retrieval)
- **Message Broker**: [Apache Kafka](https://kafka.apache.org/) (Event stream for click tracking)
- **Security**: [JWT](https://jwt.io/) (JSON Web Token authentication middleware)
- **Infra Orchestration**: Docker Compose (KRaft Kafka + Redis + Qdrant)

---

## 📂 Project Structure

```
REC-Engine-System/
├── docker-compose.yml       # Infrastructure (Redis, Qdrant, Kafka)
├── mockData.js              # Mock users, embeddings & movie catalog
├── package.json             # Project dependencies & scripts
├── testPipeline.js          # Pipeline & Auth test suite
├── testRedis.js             # Redis connectivity check
├── scripts/
│   └── bootstrapData.js     # Seeds Qdrant vectors & Redis feature store
└── src/
    ├── auth/
    │   └── jwt.js           # JWT signing & verification utilities
    ├── features/
    │   └── featureStore.js  # In-memory feature catalog fallback
    ├── inference/
    │   └── mockScorer.js    # ML-inspired CTR scoring engine
    ├── kafka/
    │   ├── kafkaClient.js   # Kafka client instance
    │   ├── producer.js      # Click event producer
    │   └── consumer.js      # Click event consumer & Redis updater
    ├── middleware/
    │   └── authMiddleware.js# Fastify JWT protection preHandler
    ├── pipeline/
    │   └── orchestrator.js  # 5-Stage Recommendation Pipeline Orchestrator
    ├── redis/
    │   ├── redisStore.js    # Redis client connection
    │   └── featureStore.js  # Redis batch feature enrichment
    ├── reranking/
    │   └── ranker.js        # Business rules, sponsored boost, filtering
    ├── retrieval/
    │   ├── qdrantClient.js  # Qdrant client connection
    │   └── vectorSearch.js  # Vector search with graceful fallback
    ├── routes/
    │   └── authRoutes.js    # /auth/login and /auth/register endpoints
    └── server.js            # Main Fastify server entry point
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/)

### 2. Clone and Install
```bash
git clone https://github.com/varshalshivhare-boop/REC-Engine-System.git
cd REC-Engine-System
npm install
```

### 3. Start Infrastructure (Docker)
```bash
docker compose up -d
```
This starts:
- **Redis** at `localhost:6379`
- **Qdrant** at `localhost:6333`
- **Kafka** (KRaft mode) at `localhost:9092`

### 4. Seed Data (Qdrant & Redis)
```bash
npm run bootstrap
```

### 5. Run the Server
```bash
# Development mode (auto-reload)
npm run dev

# Or Production start
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Server health & uptime check | No |
| `GET` | `/recommend?userId=u1` | Get personalized recommendations | Optional / Yes |
| `GET` | `/users` | List available test users | No |
| `POST` | `/auth/login` | Login with userId & password | No |
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/track-click` | Stream user click event to Kafka | No |

### Example Recommendation Query
```bash
curl "http://localhost:3000/recommend?userId=u1"
```

**Response:**
```json
{
  "userId": "u1",
  "recommendations": [
    {
      "rank": 1,
      "itemId": "C",
      "title": "Mad Max: Fury Road",
      "category": "action",
      "ml_score": 1,
      "final_score": 1.15,
      "is_sponsored": true,
      "popularity": 0.7
    },
    {
      "rank": 2,
      "itemId": "A",
      "title": "Inception",
      "category": "action",
      "ml_score": 1,
      "final_score": 1,
      "is_sponsored": false,
      "popularity": 0.8
    }
  ],
  "meta": {
    "userId": "u1",
    "total_candidates": 4,
    "returned": 2,
    "latency_ms": 1.45,
    "pipeline_stages": [
      "vector_search",
      "feature_enrichment",
      "ml_scoring",
      "reranking",
      "format"
    ]
  }
}
```

---

## 🧪 Testing

Run the automated test suite verifying auth and end-to-end recommendation flow:
```bash
npm test
```

---

## 📄 License
ISC
