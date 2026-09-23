// src/pipeline/orchestrator.js
// Main pipeline - 5-stage recommendation engine

import { vectorSearch } from "../retrieval/vectorSearch.js";
import { enrichWithFeatures, getUserFeatures } from "../redis/featureStore.js";
import { scoreItems } from "../inference/mockScorer.js";
import { rankAndFilter } from "../reranking/ranker.js";

export async function getRecommendations(userId) {
  const start = performance.now();
  console.log(`\n[Pipeline] ▶ Starting for user: ${userId}`);

  // ─── Stage 1: Vector Search ───────────────────────────────────────────────
  const candidates = await vectorSearch(userId);
  console.log(`  [Stage 1] ✅ Vector Search → ${candidates.length} candidates found`);

  // ─── Stage 2: Feature Enrichment (Redis) ─────────────────────────────────
  const userFeatures = await getUserFeatures(userId);
  const enrichedCandidates = await enrichWithFeatures(candidates);
  console.log(`  [Stage 2] ✅ Feature Enrichment → ${enrichedCandidates.length} items enriched`);
  console.log(`            User Profile: category=${userFeatures.preferred_category}, age=${userFeatures.age}`);

  // ─── Stage 3: ML Scoring ──────────────────────────────────────────────────
  const scoredItems = scoreItems(userFeatures, enrichedCandidates);
  console.log(`  [Stage 3] ✅ ML Scoring → scores range: ${Math.min(...scoredItems.map(i => i.ml_score)).toFixed(2)} - ${Math.max(...scoredItems.map(i => i.ml_score)).toFixed(2)}`);

  // ─── Stage 4: Re-Ranking (Business Rules) ────────────────────────────────
  const rankedItems = rankAndFilter(scoredItems, 5);
  console.log(`  [Stage 4] ✅ Re-Ranking → Top ${rankedItems.length} items selected`);

  // ─── Stage 5: Format Response ─────────────────────────────────────────────
  const latencyMs = (performance.now() - start).toFixed(2);
  console.log(`[Pipeline] ✅ Done in ${latencyMs}ms\n`);

  return {
    recommendations: rankedItems.map((item, index) => ({
      rank: index + 1,
      itemId: item.itemId,
      title: item.title || item.itemId,
      category: item.category,
      ml_score: item.ml_score,
      final_score: item.final_score,
      is_sponsored: item.is_sponsored || false,
      popularity: item.popularity,
    })),
    meta: {
      userId,
      total_candidates: candidates.length,
      returned: rankedItems.length,
      latency_ms: parseFloat(latencyMs),
      pipeline_stages: ["vector_search", "feature_enrichment", "ml_scoring", "reranking", "format"],
    },
  };
}
