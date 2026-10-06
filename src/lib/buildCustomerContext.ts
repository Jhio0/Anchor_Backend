import { getDependencyRegistry } from "../configuration/dependency-registry";
import { AuthProviderPort } from "../domain/provider/auth/auth.provider.port";
import { ProviderTokens } from "./injection-tokens/provider-tokens";

interface SaveFlowContext {
  // The authenticated user for this request.
  //
  // null means there is no valid session.
  currentUser: {
    userId: string;
  } | null;
}

/**
 * Builds the GraphQL context for every request.
 *
 * Apollo calls this function once for each GraphQL request.
 * It checks the session and determines the current user.
 */
export async function buildCustomerContext({
  req,
}: {
  req: {
    headers: Record<string, string | string[] | undefined>;
  };
}): Promise<SaveFlowContext> {
  const sessionId = req.headers["x-session-id"] as string | undefined;

  if (!sessionId) {
    console.log("❌ No session ID");

    return {
      currentUser: null,
    };
  }

  const dependencyRegistry = getDependencyRegistry();

  const authProvider = dependencyRegistry.resolve<AuthProviderPort>(
    ProviderTokens.AuthProviderAdapter,
  );

  const currentUser = await authProvider.getCurrentUser(sessionId);

  return {
    currentUser,
  };
}
