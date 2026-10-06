// IncomingMessage is Node's built-in type for an HTTP request object.
// Apollo Server gives us the raw HTTP request so we can read headers.
import { IncomingMessage } from "http";
import { TokenPayload, extractTokenFromHeader, verifyToken } from "./jws.util";

// Our JWT helpers

// This is the shape of the context object that every resolver will receive.
// If the user is authenticated, currentUser will have their data.
// If not authenticated (no token / bad token), currentUser will be null.
export interface GraphQLContext {
  currentUser: TokenPayload | null;
}

/**
 * This function is passed to ApolloServer as the `context` option.
 * Apollo calls it on EVERY incoming request, before any resolver runs.
 *
 * Think of it as middleware: it inspects the request, does work (token verification),
 * and returns an object that gets injected into every resolver.
 *
 * @param req - The raw HTTP request from Node.js
 * @returns GraphQLContext - available as the third argument in every resolver
 */
export function buildContext({
  req,
}: {
  req: IncomingMessage;
}): GraphQLContext {
  // Read the Authorization header from the HTTP request
  // Headers are lowercase in Node.js HTTP
  const authHeader = req.headers["authorization"] as string | undefined;

  // Extract the token from "Bearer <token>"
  const token = extractTokenFromHeader(authHeader);

  // If there's no token, the user is not logged in — that's fine, not an error.
  // Some queries/mutations are public (signup, login).
  if (!token) {
    return { currentUser: null };
  }

  // Verify the token. If it's expired or tampered with, verifyToken returns null.
  const payload = verifyToken(token);

  // Return the context. Resolvers access this as their third parameter.
  return { currentUser: payload };
}
