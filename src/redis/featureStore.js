// src/redis/featureStore.js
// Redis se items ki features batch me fetch karna (pipeline = fast!)
import redis from "./redisStore.js";

// Ek item ki features fetch karo
export async function getItemFeatures(itemId) {
  const data = await redis.get(`item:${itemId}`);
  if (!data) return null;
  return JSON.parse(data);
}

// User ki features fetch karo
export async function getUserFeatures(userId) {
  const data = await redis.get(`user:${userId}`);
  if (!data) return { age: 25, preferred_category: "action" }; // default fallback
  return JSON.parse(data);
}

// Sabhi candidates ke features ek PIPELINE me batch fetch karo (fast!)
export async function enrichWithFeatures(candidates) {
  // Pipeline = sab keys ek hi baar Redis ko bhejna (100x faster than loop)
  const pipeline = redis.pipeline();
  candidates.forEach((c) => pipeline.get(`item:${c.itemId}`));
  const results = await pipeline.exec();

  return candidates.map((candidate, i) => {
    const raw = results[i][1]; // [error, value] format
    const features = raw ? JSON.parse(raw) : {};
    return { ...candidate, ...features };
  });
}