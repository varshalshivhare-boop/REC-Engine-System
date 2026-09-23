// src/retrieval/vectorSearch.js
// Qdrant vector search - user ke liye similar items dhundhna
import qdrant from "./qdrantClient.js";

// Note: Real system me User Embeddings Machine Learning model realtime generate karega.
// Abhi hum API input simulate karne ke liye in-memory mock use kar rahe hain.
const userVectors = {
  u1: [0.9, 0.1], // Action fan
  u2: [0.2, 0.8], // Comedy fan
};

const COLLECTION_NAME = "movies";

export async function vectorSearch(userId) {
  const userVector = userVectors[userId];
  if (!userVector) {
    throw new Error(`User ${userId} ka vector nahi mila. Available users: ${Object.keys(userVectors).join(", ")}`);
  }

  try {
    // Qdrant se nearest neighbors fetch karo
    const results = await qdrant.search(COLLECTION_NAME, {
      vector: userVector,
      limit: 10,
      with_payload: true,
    });

    // Results ko simple candidate list mein convert karo
    return results.map((hit) => ({
      itemId: hit.payload.itemId,
      vector_score: hit.score,
      ...hit.payload,
    }));
  } catch (err) {
    // Agar Qdrant down ho to mock data se fallback
    console.warn("⚠️  Qdrant unavailable, falling back to mock data:", err.message);
    return getMockCandidates(userId);
  }
}

// Fallback: Qdrant ke bina bhi kaam kare
function getMockCandidates(userId) {
  const allItems = [
    { itemId: "A", vector_score: 0.94, category: "action", popularity: 0.8, ctr: 0.15, in_stock: true, is_sponsored: false, title: "Inception" },
    { itemId: "B", vector_score: 0.72, category: "comedy", popularity: 0.5, ctr: 0.08, in_stock: true, is_sponsored: false, title: "The Hangover" },
    { itemId: "C", vector_score: 0.88, category: "action", popularity: 0.7, ctr: 0.12, in_stock: true, is_sponsored: true, title: "Mad Max: Fury Road" },
    { itemId: "D", vector_score: 0.65, category: "comedy", popularity: 0.6, ctr: 0.10, in_stock: false, is_sponsored: false, title: "Superbad" },
  ];

  // u1 = action items zyada, u2 = comedy items zyada
  if (userId === "u1") {
    return allItems.sort((a, b) =>
      (a.category === "action" ? -1 : 1) - (b.category === "action" ? -1 : 1)
    );
  }
  return allItems.sort((a, b) =>
    (a.category === "comedy" ? -1 : 1) - (b.category === "comedy" ? -1 : 1)
  );
}
