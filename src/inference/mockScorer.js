// src/inference/mockScorer.js
// Mock CTR Scorer - Phase 3 me real ONNX model se replace hoga

function calculateMockScore(userFeatures, itemFeatures) {
  let score = 0.5;

  // High popularity = higher score
  if (itemFeatures.popularity) score += itemFeatures.popularity * 0.2;

  // Category match = big boost
  if (userFeatures.preferred_category && itemFeatures.category) {
    if (userFeatures.preferred_category === itemFeatures.category) score += 0.2;
  }

  // High CTR item = boost
  if (itemFeatures.ctr) score += itemFeatures.ctr;

  return Math.max(0.0, Math.min(1.0, score));
}

export function scoreItems(userFeatures, itemsFeaturesList) {
  return itemsFeaturesList.map((item) => ({
    ...item,
    score: Number(calculateMockScore(userFeatures, item).toFixed(4)),
  }));
}
