# Recommendation Engine Roadmap

This document outlines the current state and the future phases for the Node.js Recommendation Engine project.

## Current State (Phase 1)
- **Framework**: Fastify server setup (`/recommend` and `/health` endpoints).
- **Architecture**: A modular 5-stage pipeline orchestrator.
- **Data**: Mock user and movie data (`mockData.js`).
- **Storage**: Redis integrated for feature enrichment. Qdrant and Kafka set up in `docker-compose.yml` but currently mocked in code.
- **Scoring & Ranking**: Basic inference logic (`mockScorer.js`) and business rules-based reranking (`ranker.js`) implemented.

---

## Phase 2: Vector Database Integration (Next Steps)
Currently, `vectorSearch.js` uses a hardcoded mock search. The next immediate goal is to wire up Qdrant.
- Initialize Qdrant JS client in the retrieval service.
- Create a script to sync `mockData.js` vectors into the Qdrant instance mapped in docker-compose.
- Replace the mock `cosineSimilarity` function with live Qdrant API calls to fetch nearest neighbors for a given user embedding. 

## Phase 3: Event Streaming and ML Pipeline
Integration of Kafka to make the system react to real-time events.
- Implement Kafka producers in a new module to broadcast user click/view events.
- Implement Kafka consumers to update user feature profiles in Redis in real-time.
- Replace `mockScorer.js` with an ONNX runtime integration or a microservice call to an actual ML model for CTR prediction/scoring.

## Phase 4: Testing & Observability
- **Testing**: Write unit tests for pipeline stages (especially scoring and ranking business rules) using a framework like Jest or node's native test runner. Update the `"test"` script in `package.json`.
- **Telemetry**: Add structured logging and metrics (e.g., Prometheus/Grafana) to monitor latency targets (<30ms) across Redis, Qdrant, and scoring stages.

## Phase 5: Scalability & Production Readiness
- Containerize the Node.js application itself using Docker.
- Implement caching strategies for frequently requested but rarely changing user embeddings.
- Implement circuit breakers for external service dependencies (Redis, Qdrant, ML Model).
