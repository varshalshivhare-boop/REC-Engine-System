// src/inference/mockScorer.js
// Mock CTR Scorer - Phase 3 me real ONNX model se replace hoga

function calculateMockScore(userFeatures, itemFeatures) {
  let score = 0.5; // base score

  // High popularity = higher score
  if (itemFeatures.popularity) score += itemFeatures.popularity * 0.2;

  // Category match = big boost
  if (userFeatures.preferred_category && itemFeatures.category) {
    if (userFeatures.preferred_category === itemFeatures.category) {
      score += 0.3;
    }
  }

  // High CTR = slight boost
  if (itemFeatures.ctr) score += itemFeatures.ctr * 0.5;

  // Cap at 1.0
  return Math.min(score, 1.0);
}

export function scoreItems(userFeatures, candidates) {
  return candidates.map((item) => ({
    ...item,
    ml_score: parseFloat(calculateMockScore(userFeatures, item).toFixed(4)),
  }));
}
