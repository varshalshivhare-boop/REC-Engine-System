// src/kafka/kafkaClient.js
// Kafka singleton client
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "recommendation-engine",
  brokers: [process.env.KAFKA_BROKER || "127.0.0.1:9092"],
});

export default kafka;
