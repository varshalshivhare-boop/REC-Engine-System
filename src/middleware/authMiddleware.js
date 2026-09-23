// src/middleware/authMiddleware.js
// Fastify preHandler - JWT token validate karta hai
import { verifyToken } from "../auth/jwt.js";

/**
 * Fastify preHandler middleware
 * Authorization: Bearer <token> header check karta hai
 */
export async function authMiddleware(request, reply) {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ error: "Unauthorized", message: "Authorization header missing ya invalid hai" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    request.user = decoded; // user info request pe attach kar do
  } catch (err) {
    return reply.code(401).send({ error: "Unauthorized", message: "Token invalid ya expire ho gaya" });
  }
}
