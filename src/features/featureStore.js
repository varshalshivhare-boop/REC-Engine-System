// src/features/featureStore.js
// In-memory feature store (Redis ka fallback)
// Sabi user ke data ki extra information

const itemFeatures = {
  "A": {
    popularity: 0.8,
    ctr: 0.15,
    category: "action",
    in_stock: true,
    is_sponsored: false,
    title: "Inception",
  },
  "B": {
    popularity: 0.5,
    ctr: 0.08,
    category: "comedy",
    in_stock: true,
    is_sponsored: false,
    title: "The Hangover",
  },
  "C": {
    popularity: 0.7,
    ctr: 0.12,
    category: "action",
    in_stock: true,
    is_sponsored: true,
    title: "Mad Max: Fury Road",
  },
  "D": {
    popularity: 0.6,
    ctr: 0.10,
    category: "comedy",
    in_stock: false,
    is_sponsored: false,
    title: "Superbad",
  },
};

export function getItemFeaturesLocal(itemId) {
  return itemFeatures[itemId] || null;
}

export function getAllItemFeatures() {
  return itemFeatures;
}