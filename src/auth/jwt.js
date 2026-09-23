// src/auth/jwt.js
// JWT token sign aur verify karne ke liye utility functions
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rec-engine-super-secret-key-2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * User ke liye JWT token banao
 * @param {object} payload - { userId, name }
 * @returns {string} signed JWT token
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * JWT token verify karo
 * @param {string} token
 * @returns {object} decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
