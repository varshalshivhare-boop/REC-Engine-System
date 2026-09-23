// src/server.js
// Main Fastify server - sab endpoints yahan hain
import Fastify from "fastify";
import { getRecommendations } from "./pipeline/orchestrator.js";
import { trackClickEvent } from "./kafka/producer.js";
import { startConsumer } from "./kafka/consumer.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

const fastify = Fastify({ logger: false });

// ─── Routes Register ────────────────────────────────────────────────────────

// Auth routes (public - no JWT needed)
fastify.register(authRoutes, { prefix: "/auth" });

// GET /health - server alive check
fastify.get("/health", async (request, reply) => {
  return {
    status: "ok",
    service: "Recommendation Engine",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
  };
});

// GET /recommend - main recommendation endpoint
fastify.get("/recommend", async (request, reply) => {
  try {
    const { userId } = request.query;
    if (!userId) {
      return reply.code(400).send({
        error: "Bad Request",
        message: "userId query param required hai. Example: /recommend?userId=u1",
      });
    }

    const result = await getRecommendations(userId);
    return { userId, ...result };
  } catch (error) {
    console.error("❌ Error:", error.message);
    return reply.code(500).send({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// POST /track-click - user click event track karo (Kafka pe publish)
fastify.post("/track-click", async (request, reply) => {
  const { userId, itemId } = request.body || {};
  if (!userId || !itemId) {
    return reply.code(400).send({
      error: "Bad Request",
      message: "userId aur itemId dono required hain",
    });
  }

  const result = await trackClickEvent(userId, itemId);
  return {
    success: true,
    message: `Click event tracked: User ${userId} → Item ${itemId}`,
    kafka: result,
  };
});

// GET /users - available users list
fastify.get("/users", async () => {
  return {
    users: [
      { userId: "u1", name: "Alex (Action Fan)", preferred_genre: "action" },
      { userId: "u2", name: "Priya (Comedy Fan)", preferred_genre: "comedy" },
    ],
    hint: "Inme se koi bhi userId use karo /recommend?userId=u1 mein",
  };
});

// ─── Server Startup ──────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

try {
  await fastify.listen({ port: PORT, host: HOST });
  console.log("\n🚀 ═══════════════════════════════════════════════");
  console.log(`   Recommendation Engine running on port ${PORT}`);
  console.log("═══════════════════════════════════════════════");
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/recommend?userId=u1`);
  console.log(`   GET  http://localhost:${PORT}/recommend?userId=u2`);
  console.log(`   POST http://localhost:${PORT}/auth/login`);
  console.log(`   POST http://localhost:${PORT}/track-click`);
  console.log(`   GET  http://localhost:${PORT}/users`);
  console.log("═══════════════════════════════════════════════\n");

  // Kafka consumer background mein start karo
  startConsumer();
} catch (err) {
  console.error("❌ Server startup failed:", err);
  process.exit(1);
}