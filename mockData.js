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
    description: "A thief who enters the dreams of others to steal secrets from their subconscious."
  },
  {
    itemId: "B",
    title: "The Hangover",
    genre: "comedy",
    category: "comedy",
    popularity: 0.5,
    ctr: 0.08,
    match_score: 0.72,
    is_sponsored: false,
    in_stock: true,
    poster_url: "https://picsum.photos/seed/hangover/300/450",
    backdrop_url: "https://picsum.photos/seed/hangover/1200/600",
    description: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night."
  },
  {
    itemId: "C",
    title: "Mad Max: Fury Road",
    genre: "action",
    category: "action",
    popularity: 0.7,
    ctr: 0.12,
    match_score: 0.88,
    is_sponsored: true,
    in_stock: true,
    poster_url: "https://picsum.photos/seed/madmax/300/450",
    backdrop_url: "https://picsum.photos/seed/madmax/1200/600",
    description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland."
  },
  {
    itemId: "D",
    title: "Superbad",
    genre: "comedy",
    category: "comedy",
    popularity: 0.6,
    ctr: 0.10,
    match_score: 0.65,
    is_sponsored: false,
    in_stock: false,
    poster_url: "https://picsum.photos/seed/superbad/300/450",
    backdrop_url: "https://picsum.photos/seed/superbad/1200/600",
    description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-filled party goes awry."
  }
];
