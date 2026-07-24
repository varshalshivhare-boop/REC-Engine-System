// scripts/bootstrapData.js
// Redis aur Qdrant me initial mock data seed karna
import Redis from "ioredis";
import { QdrantClient } from "@qdrant/js-client-rest";

const redis = new Redis({ host: "localhost", port: 6379 });
const qdrant = new QdrantClient({ host: "localhost", port: 6333 });

const itemFeatures = {
  A: { popularity: 0.8, ctr: 0.15, category: "action", in_stock: true, is_sponsored: false },
  B: { popularity: 0.5, ctr: 0.08, category: "comedy", in_stock: true, is_sponsored: false },
  C: { popularity: 0.7, ctr: 0.12, category: "action", in_stock: true, is_sponsored: true },
};

const userFeatures = {
  u1: { age: 25, preferred_category: "action" },
  u2: { age: 30, preferred_category: "comedy" },
};

// Vector Dimensions = 2 (Mock vectors)
const itemVectors = [
  { id: 1, vector: [0.8, 0.2], payload: { itemId: "A" } },
  { id: 2, vector: [0.1, 0.9], payload: { itemId: "B" } },
  { id: 3, vector: [0.7, 0.3], payload: { itemId: "C" } },
];

const COLLECTION_NAME = "movies";

async function bootstrap() {
  console.log("🌱 Seeding Databases...");

  // 1. Redis Seeding
  for (const [itemId, features] of Object.entries(itemFeatures)) {
    await redis.set(`item:${itemId}`, JSON.stringify(features));
  }
  for (const [userId, features] of Object.entries(userFeatures)) {
    await redis.set(`user:${userId}`, JSON.stringify(features));
  }
  console.log("  ✅ Redis seeded! (User & Item profiles)");

  // 2. Qdrant Seeding
  const collections = await qdrant.getCollections();
  const exists = collections.collections.find(c => c.name === COLLECTION_NAME);
  
  if (exists) {
    await qdrant.deleteCollection(COLLECTION_NAME);
  }
  
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 2, distance: "Cosine" } // Cosine similarity natively inside DB
  });

  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: itemVectors
  });
  console.log("  ✅ Qdrant seeded! (Item vectors)");

  console.log("\n🎉 Both databases successfully populated!");
  await redis.quit();
}

bootstrap().catch((err) => {
  console.error("❌ Bootstrap failed:", err.message);
  process.exit(1);
});