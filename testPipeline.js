const { vectorSearch } = require("./src/retrieval/vectorSearch");
const { enrichWithFeatures } = require("./src/features/featureStore");

const candidates = vectorSearch("u1");
const enrichedCandidates = enrichWithFeatures(candidates);

console.log(enrichedCandidates);