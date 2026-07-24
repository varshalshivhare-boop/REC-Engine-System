// src/server.js
import Fastify from "fastify";
import { getRecommendations } from "./pipeline/orchestrator.js";

const fastify = Fastify({ logger: false });

fastify.get("/recommend", async (request, reply) => {
  try {
    const { userId } = request.query;
    if (!userId) {
      return reply.code(400).send({ error: "userId is required" });
    }

    const result = await getRecommendations(userId);
    return { userId, ...result };

  } catch (error) {
    console.error("❌ Error:", error.message);
    return reply.code(500).send({ error: "Internal Server Error", message: error.message });
  }
});

import { trackClickEvent } from "./kafka/producer.js";

fastify.get("/health", async () => {
  return { status: "ok", message: "Server is running!" };
});

fastify.post("/click", async (request, reply) => {
  try {
    const { userId, itemId } = request.body || {};
    if (!userId || !itemId) {
      return reply.code(400).send({ error: "userId and itemId are required" });
    }

    // Publish event to Kafka stream in background (ultra-fast)
    await trackClickEvent(userId, itemId);

    return { status: "ok", message: "Click event tracked in real-time" };
  } catch (error) {
    return reply.code(500).send({ error: "Server Error", message: error.message });
  }
});

const PORT = 8080;
fastify.listen({ port: PORT }, (err) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Try: http://localhost:${PORT}/recommend?userId=u1`);
});