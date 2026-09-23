// src/redis/featureStore.js
// Redis se items ki features batch me fetch karna (pipeline = fast!)
import redis from "./redisStore.js";

// Ek item ki features fetch karo
export async function getItemFeatures(itemId) {
  try {
    const data = await redis.get(`item:${itemId}`);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.warn(`⚠️  Redis unavailable for item:${itemId}:`, err.message);
    return null;
  }
}

// User ki features fetch karo
export async function getUserFeatures(userId) {
  try {
    const data = await redis.get(`user:${userId}`);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.warn(`⚠️  Redis unavailable for user:${userId}:`, err.message);
  }
  // Default fallback
  const defaults = {
    u1: { age: 25, preferred_category: "action" },
    u2: { age: 30, preferred_category: "comedy" },
  };
  return defaults[userId] || { age: 25, preferred_category: "action" };
}

// Candidates ki features Redis se batch me fetch karke enrich karo
export async function enrichWithFeatures(candidates) {
  const enriched = await Promise.all(
    candidates.map(async (candidate) => {
      const features = await getItemFeatures(candidate.itemId);
      if (features) {
        // Redis se mili features merge karo candidate ke saath
        return { ...candidate, ...features };
      }
      // Redis miss hone par candidate already has mock features from vectorSearch fallback
      return candidate;
    })
  );
  return enriched;
}