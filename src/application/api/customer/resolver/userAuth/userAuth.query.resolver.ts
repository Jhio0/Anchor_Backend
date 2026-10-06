import { GraphQLContext, Resolver } from "myLibrary";
import { RepositoryTokens } from "../../../../../lib/injection-tokens/repository-tokens";
import { inject } from "../../../../../lib/strict-inject";
import { UserRepositoryPort } from "../../../../../domain/repository/user.repository.port";
import { AuthPayload, User } from "../../schema";
import { AuthProviderPort } from "../../../../../domain/provider/auth/auth.provider.port";
import { ProviderTokens } from "../../../../../lib/injection-tokens/provider-tokens";

// user.query.resolver.ts
@Resolver
export class UserAuthQueryResolver {
  constructor(
    @inject(RepositoryTokens.UserRepository)
    private userRepositoryPort: UserRepositoryPort,
    @inject(ProviderTokens.AuthProviderAdapter)
    private authProviderPort: AuthProviderPort,
  ) {}
  /**
   * Returns the currently authenticated user.
   *
   * context is the third argument to every resolver.
   * Apollo automatically passes it in — you never call this function directly.
   *
   * Resolver signature: (parent, args, context, info)
   * - parent: result from the parent resolver (unused here, hence _)
   * - args: arguments from the GraphQL query (unused here)
   * - context: our GraphQLContext — has currentUser if token was valid
   */
  async me(
    _: unknown,
    __: unknown,
    context: GraphQLContext,
  ): Promise<User | null> {
    if (!context.currentUser) return null;

    const user = await this.userRepositoryPort.findById(
      context.currentUser.userId,
    );

    if (!user) return null;

    const date = new Date(user.dateOfBirth).toDateString();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      dateOfBirth: date,
    };
  }

  /**
   * LOGIN mutation
   * Verifies credentials and returns a token.
   */
  async login(
    _: unknown,
    args: { email: string; password: string },
  ): Promise<AuthPayload> {
    return this.authProviderPort.login({
      email: args.email,
      password: args.password,
    });
  }
}
