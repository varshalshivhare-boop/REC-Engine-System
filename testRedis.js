// testRedis.js
// Utility script to verify Redis connectivity
import redis from "./src/redis/redisStore.js";

async function checkRedis() {
  console.log("🔍 Checking Redis connection...");
  try {
    await redis.set("test_key", "rec_engine_ping", "EX", 10);
    const val = await redis.get("test_key");
    if (val === "rec_engine_ping") {
      console.log("✅ Redis Ping/Pong successful! Value:", val);
    } else {
      console.log("⚠️ Unexpected Redis value:", val);
    }
  } catch (err) {
    console.error("❌ Redis test error (Is Redis running on 6379?):", err.message);
  } finally {
    await redis.quit();
    process.exit(0);
  }
}

checkRedis();