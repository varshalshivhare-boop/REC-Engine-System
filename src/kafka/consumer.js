import kafka from "./kafkaClient.js";
import redis from "../redis/redisStore.js";

const consumer = kafka.consumer({ groupId: "recommendation-group" });

async function runConsumer() {
  await consumer.connect();
  console.log("✅ Kafka Consumer Connected and listening for clicks...");

  await consumer.subscribe({ topic: "user-clicks", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`\n[Kafka] 🚀 Consumed event: User ${event.userId} clicked Item ${event.itemId}`);

      // Background Real-time Feature Update in Redis
      const userKey = `user:${event.userId}`;
      const userProfileRaw = await redis.get(userKey);
      
      if (userProfileRaw) {
        const userProfile = JSON.parse(userProfileRaw);
        
        // Dynamically increment real-time features
        userProfile.total_clicks = (userProfile.total_clicks || 0) + 1;
        userProfile.last_clicked_item = event.itemId;
        
        await redis.set(userKey, JSON.stringify(userProfile));
        console.log(`  ➔ [Redis Update] Updated profile for ${event.userId} (total_clicks: ${userProfile.total_clicks})`);
      }
    },
  });
}

runConsumer().catch(console.error);
