// src/kafka/consumer.js
// Kafka Consumer - user-clicks topic sunता है aur Redis update karta hai
import kafka from "./kafkaClient.js";
import redis from "../redis/redisStore.js";

const consumer = kafka.consumer({ groupId: "recommendation-group" });

async function runConsumer() {
  await consumer.connect();
  console.log("✅ Kafka Consumer Connected and listening for clicks...");

  await consumer.subscribe({ topic: "user-clicks", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log(`\n[Kafka] 🚀 Consumed event: User ${event.userId} clicked Item ${event.itemId}`);

        // Redis mein click count increment karo
        await redis.hincrby(`clicks:${event.userId}`, event.itemId, 1);

        // Item ki CTR update karo (clicks / total impressions approximation)
        const clicks = await redis.hget(`clicks:${event.userId}`, event.itemId);
        console.log(`[Kafka] 📊 Total clicks by ${event.userId} on ${event.itemId}: ${clicks}`);

        // Event timestamp bhi store karo
        await redis.set(
          `last_click:${event.userId}:${event.itemId}`,
          event.timestamp,
          "EX",
          86400 // 24 ghante baad expire
        );
      } catch (err) {
        console.error("[Kafka] ❌ Error processing message:", err.message);
      }
    },
  });
}

export async function startConsumer() {
  try {
    await runConsumer();
  } catch (err) {
    console.error("❌ Kafka Consumer failed to start:", err.message);
    console.warn("⚠️  Click tracking disabled. Kafka running hai? (docker compose up -d)");
  }
}

export async function stopConsumer() {
  await consumer.disconnect();
  console.log("🔌 Kafka Consumer Disconnected");
}
