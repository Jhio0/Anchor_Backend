import { enumFromKeyStringThrow, GraphQLContext, Resolver } from "myLibrary";
import { inject } from "../../../../../lib/strict-inject";
import { ProviderTokens } from "../../../../../lib/injection-tokens/provider-tokens";
import ApplicationProviderPort from "../../../../../domain/provider/application.provider.port";
import { ApplicationPayload } from "../../schema";
import { ApplicationType } from "../../../../../domain/entities/application";

@Resolver
export class CreateApplicationMutationResolver {
  constructor(
    @inject(ProviderTokens.ApplicationProviderAdapter)
    private applicationProviderPort: ApplicationProviderPort,
  ) {}

  async createApplication(
    _: unknown,
    args: { type: string },
    context: GraphQLContext,
  ): Promise<ApplicationPayload> {
    if (!context.currentUser) {
      throw new Error("No currentUser investigate Pls");
    }

    return await this.applicationProviderPort.createApplication(
      context.currentUser.userId,
      enumFromKeyStringThrow(ApplicationType, args.type),
    );
  }
}
