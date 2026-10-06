import { Resolver } from "myLibrary";
import { AuthProviderPort } from "../../../../../domain/provider/auth/auth.provider.port";
import { ProviderTokens } from "../../../../../lib/injection-tokens/provider-tokens";
import { inject } from "../../../../../lib/strict-inject";
import { AuthPayload } from "../../schema";

@Resolver
export class UserAuthMutationResolver {
  constructor(
    @inject(ProviderTokens.AuthProviderAdapter)
    private authProviderPort: AuthProviderPort,
  ) {}

  /**
   * SIGNUP mutation
   * Creates a new account and returns a token immediately (auto-login after signup).
   */
  async signup(
    _: unknown,
    args: {
      name: string;
      email: string;
      password: string;
      dateOfBirth: string;
    },
  ): Promise<AuthPayload> {
    return this.authProviderPort.signup({
      name: args.name,
      email: args.email,
      password: args.password,
      dateOfBirth: args.dateOfBirth,
    });
  }
}
