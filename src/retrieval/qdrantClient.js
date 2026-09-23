// src/retrieval/qdrantClient.js
// Qdrant vector DB client singleton
import { QdrantClient } from "@qdrant/js-client-rest";

// Connect to local Qdrant running in Docker
const qdrant = new QdrantClient({
  host: process.env.QDRANT_HOST || "localhost",
  port: parseInt(process.env.QDRANT_PORT) || 6333,
});

export default qdrant;
