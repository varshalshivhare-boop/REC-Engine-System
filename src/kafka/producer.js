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

export async function trackClickEvent(userId, itemId) {
  try {
    await connectProducer();
    await producer.send({
      topic: "user-clicks",
      messages: [
        { value: JSON.stringify({ userId, itemId, timestamp: Date.now() }) },
      ],
    });
    console.log(`[Kafka] 📥 Sent click event to stream: ${userId} -> ${itemId}`);
  } catch (error) {
    console.error("❌ Kafka Producer Error:", error);
  }
}
