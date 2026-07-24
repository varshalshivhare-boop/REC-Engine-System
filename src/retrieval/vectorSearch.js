// src/retrieval/vectorSearch.js
// Real Qdrant vector search implementation
import qdrant from "./qdrantClient.js";

// Note: Real system me User Embeddings Machine Learning model realtime generate karega. 
// Abhi hum API input simulate karne ke liye in-memory mock use kar rahe hain.
const userVectors = {
  u1: [0.9, 0.1], // Action fan
  u2: [0.2, 0.8], // Comedy fan
};

export async function vectorSearch(userId) {
  const userVector = userVectors[userId];
  if (!userVector) throw new Error(`User ${userId} not found`);

  // Call real Qdrant Database over REST API
  const results = await qdrant.search("movies", {
    vector: userVector,
    limit: 3 // top-K retrieval
  });

  // Extract itemId from the database payload and the similarity score
  return results.map(hit => ({
    itemId: hit.payload.itemId,
    similarity: hit.score
  }));
}
