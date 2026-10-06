// jsonwebtoken is the library that creates and verifies JWTs
import jwt from "jsonwebtoken";

// This is the secret key used to SIGN tokens.
// Think of it as a private stamp — anyone with this secret can create valid tokens.
// NEVER commit this to git. In production, load from environment variables.
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

// How long until a token expires. "7d" = 7 days.
// After this, the user must log in again.
const JWT_EXPIRES_IN = "7d";

// This describes the data we store INSIDE the token (the payload).
// We store the user's ID and email so we can identify them later
// without hitting the database on every single request.
export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Creates a signed JWT token containing the user's ID and email.
 *
 * Called after: successful login OR successful signup.
 * The client stores this token and sends it with every future request.
 */
export function signToken(payload: TokenPayload): string {
  // jwt.sign(data, secret, options) → returns the token string
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies a token and returns its payload.
 *
 * Called on EVERY request to check: is this token valid? Who sent it?
 * Returns null if the token is invalid or expired — meaning the user is not authenticated.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    // jwt.verify throws an error if the token is invalid/expired.
    // Casting is safe here because we control what we put in signToken above.
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    // Invalid token, expired token, tampered token — all return null
    return null;
  }
}

/**
 * Extracts the raw token from an Authorization header.
 *
 * HTTP convention: clients send tokens as:
 *   Authorization: Bearer eyJhbGci...
 *
 * We strip the "Bearer " prefix to get just the token string.
 */
export function extractTokenFromHeader(
  authHeader: string | undefined,
): string | null {
  if (!authHeader) return null;

  // "Bearer eyJhbGci..." → ["Bearer", "eyJhbGci..."]
  const parts = authHeader.split(" ");

  // Must have exactly two parts: "Bearer" and the token
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
}
