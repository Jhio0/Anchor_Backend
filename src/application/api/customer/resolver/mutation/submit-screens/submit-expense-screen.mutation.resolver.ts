import { enumFromKeyStringThrow, GraphQLContext, Resolver } from "myLibrary";
import { inject } from "../../../../../../lib/strict-inject";
import { ProviderTokens } from "../../../../../../lib/injection-tokens/provider-tokens";
import { SubmitCollectedExpenseDataProviderPort } from "../../../../../../domain/provider/node-handlers/submit-collected-expense-data.provider.port";
import { ApplicationPayload, ExpenseApplicationInput } from "../../../schema";
import { ExpenseSource } from "../../../../../../domain/entities/collected-expsense-data";
import { buildApplicationPayload } from "./mapper/application-payload.mapper";

@Resolver
export class SubmitExpenseScreenMutationResolver {
  constructor(
    @inject(ProviderTokens.SubmitCollectedExpenseDataProviderAdapter)
    private submitCollectedExpenseDataProviderPort: SubmitCollectedExpenseDataProviderPort,
  ) {}

  async submitExpenseScreen(
    _: unknown,
    args: { input: ExpenseApplicationInput },
    context: GraphQLContext,
  ): Promise<ApplicationPayload> {
    const { items, applicationId } = args.input;
    const screen =
      await this.submitCollectedExpenseDataProviderPort.handleExpenseNode({
        applicationId,
        items: items.map((item) => ({
          name: item.name,
          amount: item.amount,
          source: enumFromKeyStringThrow(ExpenseSource, item.source),
        })),
      });

    return buildApplicationPayload(screen);
  }
}
