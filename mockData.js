// mockData.js
// ⚠️ YE DATA AAPKE BACKEND FILES (vectorSearch.js aur featureStore.js) SE MAP KIYA GAYA HAI.

export const MOCK_USERS = [
  { userId: "u1", name: "Alex (Action Fan)", avatar: "😊", preferred_genre: "action" },
  { userId: "u2", name: "Priya (Comedy Fan)", avatar: "🎭", preferred_genre: "comedy" }
];

export const MOCK_MOVIES = [
  {
    itemId: "A",
    title: "Inception",
    genre: "action",
    category: "action",
    popularity: 0.8,
    ctr: 0.15,
    match_score: 0.94,
    is_sponsored: false,
    in_stock: true,
    poster_url: "https://picsum.photos/seed/inception/300/450",
    backdrop_url: "https://picsum.photos/seed/inception/1200/600",
    description: "A thief who enters the dreams of others to steal secrets..."
  },
  {
    itemId: "B",
    title: "The Hangover",
    genre: "comedy",
    category: "comedy",
    popularity: 0.5,
    ctr: 0.08,
    match_score: 0.89,
    is_sponsored: false,
    in_stock: true,
    poster_url: "https://picsum.photos/seed/hangover/300/450",
    backdrop_url: "https://picsum.photos/seed/hangover/1200/600",
    description: "Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night..."
  },
  {
    itemId: "C",
    title: "The Dark Knight",
    genre: "action",
    category: "action",
    popularity: 0.7,
    ctr: 0.12,
    match_score: 0.85,
    is_sponsored: true, // Sponsored item boost test karne ke liye
    in_stock: true,
    poster_url: "https://picsum.photos/seed/batman/300/450",
    backdrop_url: "https://picsum.photos/seed/batman/1200/600",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham..."
  }
];

export const MOCK_HEALTH = {
  latency_ms: 28,
  services: {
    qdrant:     { status: "online", latency_ms: 3 },
    redis:      { status: "online", latency_ms: 1 },
    python_ml:  { status: "online", latency_ms: 8 },
    kafka:      { status: "online", latency_ms: 0 },
    nodejs_api: { status: "online", latency_ms: 2 }
  },
  stats: {
    total_recommendations_served: 45200,
    total_users: 2,
    avg_latency_ms: 27.4
  },
  recent_events: [
    { userId: "u1", item: "Inception", time: "2s ago" },
    { userId: "u2", item: "The Hangover", time: "5s ago" }
  ]
};
