import { enumFromKeyStringThrow, GraphQLContext, Resolver } from "myLibrary";
import { UpdateCollectedExpenseDataInput } from "../../schema";
import { inject } from "tsyringe";
import { ProviderTokens } from "../../../../../lib/injection-tokens/provider-tokens";
import { CollectedExpenseDataProviderPort } from "../../../../../domain/provider/collected-expense-data.provider.port";
import { ExpenseSource } from "../../../../../domain/entities/collected-expsense-data";

@Resolver
export class UpdateCollectedExpenseDataResolver {
  constructor(
    @inject(ProviderTokens.CollectedExpenseDataProviderAdapter)
    private collectedExpenseDataProviderPort: CollectedExpenseDataProviderPort,
  ) {}

  async updateCollectedExpenseItems(
    _: unknown,
    args: { input: UpdateCollectedExpenseDataInput },
    context: GraphQLContext,
  ): Promise<Boolean> {
    const userId = context.currentUser?.userId;

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const { category, items } = args.input;

    return await this.collectedExpenseDataProviderPort.updateCollectedExpenseItems(
      {
        userId,
        category: enumFromKeyStringThrow(ExpenseSource, category),
        items: items.map((item) => ({
          name: item.name,
          amount: item.amount,
        })),
      },
    );
  }
}
