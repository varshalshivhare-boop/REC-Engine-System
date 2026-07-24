// src/pipeline/orchestrator.js
// Main pipeline - ab Redis se real data fetch hoga!

import { vectorSearch } from "../retrieval/vectorSearch.js";
import { enrichWithFeatures, getUserFeatures } from "../redis/featureStore.js";
import { scoreItems } from "../inference/mockScorer.js";
import { rankAndFilter } from "../reranking/ranker.js";

export async function getRecommendations(userId) {
  const start = performance.now();
  console.log(`\n[Pipeline] ▶ Starting for user: ${userId}`);

  // Stage 1: Vector Search (REAL Qdrant se ab!)
  const candidates = await vectorSearch(userId);
  console.log(`  [Stage 1] Qdrant Vector Search → ${candidates.length} candidates found`);

  // Stage 2: Feature Enrichment (REAL Redis se ab!)
  const enriched = await enrichWithFeatures(candidates);
  console.log(`  [Stage 2] Redis Features fetched for ${enriched.length} items`);

  // Stage 3: User Features fetch karo (REAL Redis se!)
  const userFeatures = await getUserFeatures(userId);
  console.log(`  [Stage 3] User profile loaded: ${JSON.stringify(userFeatures)}`);

  // Stage 4: Mock ML Scoring
  const scored = scoreItems(userFeatures, enriched);
  console.log(`  [Stage 4] Mock ML scores calculated`);

  // Stage 5: Re-ranking + Business rules
  const finalResults = rankAndFilter(scored, 3);
  console.log(`  [Stage 5] Re-ranked → Top ${finalResults.length} items`);

  const latency = (performance.now() - start).toFixed(2);
  console.log(`[Pipeline] ✅ Done in ${latency}ms\n`);

  return { recommendations: finalResults, latency_ms: latency };
}
