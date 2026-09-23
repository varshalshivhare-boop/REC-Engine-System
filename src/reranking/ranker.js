// src/reranking/ranker.js
// Business rules: filter + boost + sort

export function rankAndFilter(scoredItems, topK = 10) {
  // 1. Out of stock items hatao
  let items = scoredItems.filter((item) => item.in_stock !== false);

  // 2. Sponsored items ko 15% boost do
  items = items.map((item) => ({
    ...item,
    final_score: parseFloat(
      (item.is_sponsored ? item.ml_score * 1.15 : item.ml_score).toFixed(4)
    ),
  }));

  // 3. Score ke hisaab se sort karo (highest first)
  items.sort((a, b) => b.final_score - a.final_score);

  // 4. Top K results return karo
  return items.slice(0, topK);
}
