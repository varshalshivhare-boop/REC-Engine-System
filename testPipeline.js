// testPipeline.js
// End-to-end pipeline & auth verification script
import { getRecommendations } from "./src/pipeline/orchestrator.js";
import { signToken, verifyToken } from "./src/auth/jwt.js";

async function runTests() {
  console.log("🧪 ===================================================");
  console.log("   Running Recommendation Engine Pipeline Tests");
  console.log("===================================================\n");

  // 1. Auth Test
  console.log("🔹 Test 1: Testing JWT Sign & Verify");
  const testPayload = { userId: "u1", name: "Alex" };
  const token = signToken(testPayload);
  const decoded = verifyToken(token);
  if (decoded.userId !== testPayload.userId) {
    throw new Error("❌ Auth test failed: User ID mismatch");
  }
  console.log("   ✅ JWT Token generation & verification successful!\n");

  // 2. User 1 Recommendation Pipeline Test (Action Fan)
  console.log("🔹 Test 2: Testing Recommendation Pipeline for u1 (Action Fan)");
  const resU1 = await getRecommendations("u1");
  console.log(`   Total returned: ${resU1.recommendations.length}`);
  console.log(`   Top recommendation: ${resU1.recommendations[0].title} (Final Score: ${resU1.recommendations[0].final_score})`);
  if (!resU1.recommendations || resU1.recommendations.length === 0) {
    throw new Error("❌ Pipeline test failed: No recommendations returned for u1");
  }
  console.log("   ✅ Pipeline run for u1 successful!\n");

  // 3. User 2 Recommendation Pipeline Test (Comedy Fan)
  console.log("🔹 Test 3: Testing Recommendation Pipeline for u2 (Comedy Fan)");
  const resU2 = await getRecommendations("u2");
  console.log(`   Total returned: ${resU2.recommendations.length}`);
  console.log(`   Top recommendation: ${resU2.recommendations[0].title} (Final Score: ${resU2.recommendations[0].final_score})`);
  if (!resU2.recommendations || resU2.recommendations.length === 0) {
    throw new Error("❌ Pipeline test failed: No recommendations returned for u2");
  }
  console.log("   ✅ Pipeline run for u2 successful!\n");

  console.log("===================================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  console.log("===================================================\n");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});