// src/routes/authRoutes.js
// Auth routes: /login aur /register
import { signToken } from "../auth/jwt.js";

// Mock user database (Phase 2 me real DB se replace hoga)
const MOCK_USERS_DB = {
  u1: { userId: "u1", name: "Alex", password: "password123", preferred_genre: "action" },
  u2: { userId: "u2", name: "Priya", password: "password456", preferred_genre: "comedy" },
};

export default async function authRoutes(fastify) {
  // POST /login - userId aur password se token lo
  fastify.post("/login", async (request, reply) => {
    const { userId, password } = request.body || {};
    if (!userId || !password) {
      return reply.code(400).send({ error: "userId aur password dono required hain" });
    }

    const user = MOCK_USERS_DB[userId];
    if (!user || user.password !== password) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = signToken({ userId: user.userId, name: user.name });
    return reply.send({
      success: true,
      token,
      user: { userId: user.userId, name: user.name, preferred_genre: user.preferred_genre },
      message: "Login successful! Token 24 ghante valid rahega.",
    });
  });

  // POST /register - naya user register karo (mock)
  fastify.post("/register", async (request, reply) => {
    const { userId, name, password, preferred_genre } = request.body || {};
    if (!userId || !name || !password) {
      return reply.code(400).send({ error: "userId, name, aur password required hain" });
    }

    if (MOCK_USERS_DB[userId]) {
      return reply.code(409).send({ error: `User ${userId} already exists` });
    }

    MOCK_USERS_DB[userId] = { userId, name, password, preferred_genre: preferred_genre || "action" };
    const token = signToken({ userId, name });

    return reply.code(201).send({
      success: true,
      token,
      user: { userId, name, preferred_genre: preferred_genre || "action" },
      message: "Registration successful!",
    });
  });
}
