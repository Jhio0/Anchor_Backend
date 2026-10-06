import { inject } from "tsyringe";
import { ProviderTokens } from "../../../../../../lib/injection-tokens/provider-tokens";
import { GraphQLContext, Resolver } from "myLibrary";
import {
  ApplicationPayload,
  CollectIncomeApplicationInput,
} from "../../../schema";
import SubmitIncomeNodeHandlerProviderPort from "../../../../../../domain/provider/node-handlers/submit-income-node-handler.provider.port";
import { buildApplicationPayload } from "./mapper/application-payload.mapper";

@Resolver
export class SubmitIncomeScreenMutationResolver {
  constructor(
    @inject(ProviderTokens.SubmitIncomeNodeHandlerProviderAdapter)
    private submitIncomeNodeHandlerProvider: SubmitIncomeNodeHandlerProviderPort,
  ) {}

  async submitCollectIncomeScreen(
    _: unknown,
    args: { input: CollectIncomeApplicationInput },
    context: GraphQLContext,
  ): Promise<ApplicationPayload> {
    const screen =
      await this.submitIncomeNodeHandlerProvider.handleIncomeNodeHandler({
        applicationId: args.input.applicationId,
        incomeAmount: args.input.incomeAmount,
      });

    console.log(screen);

    return buildApplicationPayload(screen);
  }
}
