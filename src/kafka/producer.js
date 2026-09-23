// src/kafka/producer.js
// Kafka Producer - user click events publish karta hai
import kafka from "./kafkaClient.js";

const producer = kafka.producer();
let isConnected = false;

export async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("✅ Kafka Producer Connected");
  }
}

export async function disconnectProducer() {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
    console.log("🔌 Kafka Producer Disconnected");
  }
}

/**
 * User click event Kafka pe publish karo
 * @param {string} userId
 * @param {string} itemId
 */
export async function trackClickEvent(userId, itemId) {
  try {
    await connectProducer();
    await producer.send({
      topic: "user-clicks",
      messages: [
        {
          key: userId,
          value: JSON.stringify({
            userId,
            itemId,
            timestamp: new Date().toISOString(),
            eventType: "click",
          }),
        },
      ],
    });
    console.log(`📤 [Kafka] Click event sent → User: ${userId}, Item: ${itemId}`);
    return { success: true };
  } catch (err) {
    console.error("❌ [Kafka] Producer error:", err.message);
    // Kafka down ho to silently fail — recommendation engine block nahi hona chahiye
    return { success: false, error: err.message };
  }
}
