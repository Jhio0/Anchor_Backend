import { GraphQLContext, Resolver } from "myLibrary";
import { CreateSpendingPlanInput, SpendingPlan } from "../../schema";
import { inject } from "../../../../../lib/strict-inject";
import { ProviderTokens } from "../../../../../lib/injection-tokens/provider-tokens";
import { SpendingPlanProviderAdapter } from "../../../../../domain/provider/spending-plan.provider.adapter";

@Resolver
export class CreateSpendingPlanMutationResolver {
  constructor(
    @inject(ProviderTokens.SpendingPlanProviderAdapter)
    private spendingPlanProviderPort: SpendingPlanProviderAdapter,
  ) {}

  async createSpendingPlan(
    _: unknown,
    args: { input: CreateSpendingPlanInput },
    context: GraphQLContext,
  ): Promise<SpendingPlan> {
    if (!context.currentUser) {
      throw new Error("No currentUser investigate Pls");
    }

    const spendingPlan = await this.spendingPlanProviderPort.createSpendingPlan(
      {
        userId: context.currentUser?.userId,
        collectedExpenseId: args.input.collectedExpenseId,
        monthLabel: new Date(),
        totalBudget: args.input.amount,
      },
    );

    return {
      allocation: spendingPlan.allocations,
      monthLabel: spendingPlan.monthLabel.toISOString().slice(0, 7),
      totalBudget: spendingPlan.totalBudget,
    };
  }
}
