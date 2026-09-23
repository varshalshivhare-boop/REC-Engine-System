// scripts/bootstrapData.js
// Redis aur Qdrant me initial mock data seed karna
// Run: node scripts/bootstrapData.js

import Redis from "ioredis";
import { QdrantClient } from "@qdrant/js-client-rest";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});
const qdrant = new QdrantClient({
  host: process.env.QDRANT_HOST || "localhost",
  port: 6333,
});

// ─── Item Features (Redis mein store honge) ──────────────────────────────────
const itemFeatures = {
  A: { popularity: 0.8, ctr: 0.15, category: "action", in_stock: true, is_sponsored: false, title: "Inception" },
  B: { popularity: 0.5, ctr: 0.08, category: "comedy", in_stock: true,  is_sponsored: false, title: "The Hangover" },
  C: { popularity: 0.7, ctr: 0.12, category: "action", in_stock: true,  is_sponsored: true,  title: "Mad Max: Fury Road" },
  D: { popularity: 0.6, ctr: 0.10, category: "comedy", in_stock: false, is_sponsored: false, title: "Superbad" },
};

// ─── User Features (Redis mein store honge) ──────────────────────────────────
const userFeatures = {
  u1: { age: 25, preferred_category: "action" },
  u2: { age: 30, preferred_category: "comedy" },
};

// ─── Item Vectors (Qdrant mein upsert honge) ─────────────────────────────────
// Vector Dimensions = 2 (Mock: [action_score, comedy_score])
const itemVectors = [
  { id: 1, vector: [0.8, 0.2], payload: { itemId: "A", title: "Inception",        category: "action" } },
  { id: 2, vector: [0.1, 0.9], payload: { itemId: "B", title: "The Hangover",     category: "comedy" } },
  { id: 3, vector: [0.7, 0.3], payload: { itemId: "C", title: "Mad Max: Fury Road", category: "action" } },
  { id: 4, vector: [0.2, 0.8], payload: { itemId: "D", title: "Superbad",         category: "comedy" } },
];

const COLLECTION_NAME = "movies";
const VECTOR_SIZE = 2;

// ─── Seed Redis ───────────────────────────────────────────────────────────────
async function seedRedis() {
  console.log("\n📦 Seeding Redis...");
  for (const [itemId, features] of Object.entries(itemFeatures)) {
    await redis.set(`item:${itemId}`, JSON.stringify(features));
    console.log(`  ✅ item:${itemId} → ${features.title}`);
  }
  for (const [userId, features] of Object.entries(userFeatures)) {
    await redis.set(`user:${userId}`, JSON.stringify(features));
    console.log(`  ✅ user:${userId} → preferred: ${features.preferred_category}`);
  }
  console.log("✅ Redis seeding complete!\n");
}

// ─── Seed Qdrant ─────────────────────────────────────────────────────────────
async function seedQdrant() {
  console.log("📦 Seeding Qdrant...");

  // Collection exist karta hai? Delete karke naya banao
  try {
    await qdrant.deleteCollection(COLLECTION_NAME);
    console.log(`  🗑️  Old collection '${COLLECTION_NAME}' deleted`);
  } catch {
    // Collection nahi tha — koi baat nahi
  }

  // Naya collection banao
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: {
      size: VECTOR_SIZE,
      distance: "Cosine",
    },
  });
  console.log(`  ✅ Collection '${COLLECTION_NAME}' created (size=${VECTOR_SIZE}, distance=Cosine)`);

  // Vectors upsert karo
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: itemVectors,
  });
  console.log(`  ✅ ${itemVectors.length} vectors upserted`);
  itemVectors.forEach((v) => console.log(`     id=${v.id} → ${v.payload.title}`));
  console.log("✅ Qdrant seeding complete!\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Bootstrap Data Script Starting...");
  console.log("════════════════════════════════════");

  try {
    await seedRedis();
    await seedQdrant();
    console.log("════════════════════════════════════");
    console.log("🎉 All data seeded successfully!");
    console.log("   Ab server start karo: npm start");
    console.log("   GET http://localhost:3000/recommend?userId=u1");
  } catch (err) {
    console.error("\n❌ Bootstrap failed:", err.message);
    console.error("   Redis aur Qdrant running hain? docker compose up -d");
  } finally {
    await redis.quit();
    process.exit(0);
  }
}

main();