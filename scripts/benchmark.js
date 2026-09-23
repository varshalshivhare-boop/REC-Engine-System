// scripts/benchmark.js
// Lean, accurate latency test for REC-Engine-System

import { scoreItems } from "../src/inference/mockScorer.js";
import { rankAndFilter } from "../src/reranking/ranker.js";

function dotProductSim(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function testScale(N) {
  const user = { userId: "u1", preferred_category: "action", age: 25, vector: [0.9, 0.1] };
  const items = [];
  const categories = ["action", "comedy", "drama", "scifi"];

  for (let i = 0; i < N; i++) {
    items.push({
      itemId: `item_${i}`,
      title: `Item ${i}`,
      category: categories[i % 4],
      vector: [Math.random(), Math.random()],
      popularity: 0.7,
      ctr: 0.1,
      in_stock: true,
      is_sponsored: i % 10 === 0,
    });
  }

  // Measure 30 runs
  const latencies = [];
  for (let run = 0; run < 30; run++) {
    const t0 = performance.now();

    // 1. Vector similarity search
    const candidates = [];
    for (let i = 0; i < items.length; i++) {
      const score = dotProductSim(user.vector, items[i].vector);
      candidates.push({ ...items[i], vector_score: score });
    }
    candidates.sort((a, b) => b.vector_score - a.vector_score);
    const topCandidates = candidates.slice(0, 20);

    // 2. Feature enrichment
    const enriched = topCandidates.map((c) => ({ ...c, enriched: true }));

    // 3. ML Scoring
    const scored = scoreItems(user, enriched);

    // 4. Reranking & Filtering
    const finalResult = rankAndFilter(scored, 5);

    const t1 = performance.now();
    latencies.push(t1 - t0);
  }

  latencies.sort((a, b) => a - b);
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const min = latencies[0];
  const max = latencies[latencies.length - 1];

  return { N, avg, p50, p95, min, max };
}

console.log("=========================================================================");
console.log("⚡ RECOMMENDATION ENGINE — LATENCY vs DATA SCALE BENCHMARK");
console.log("=========================================================================\n");

const scales = [10, 50, 100, 500, 1000, 2500];
const results = scales.map((n) => testScale(n));

console.table(
  results.map((r) => ({
    "Catalog Size": `${r.N} items`,
    "Avg Latency": `${r.avg.toFixed(3)} ms`,
    "P50 (Median)": `${r.p50.toFixed(3)} ms`,
    "P95": `${r.p95.toFixed(3)} ms`,
    "Min": `${r.min.toFixed(3)} ms`,
    "Max": `${r.max.toFixed(3)} ms`,
    "Throughput": `${Math.round(1000 / r.avg)} req/sec`,
  }))
);

console.log("=========================================================================");
