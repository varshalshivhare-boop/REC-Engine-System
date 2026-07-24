import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "recommendation-engine",
  brokers: ["127.0.0.1:9092"],
});

export default kafka;
