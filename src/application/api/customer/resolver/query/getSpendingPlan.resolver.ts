import { GraphQLContext, Resolver } from "myLibrary";
import { SpendingPlan } from "../../schema";
import { inject } from "tsyringe";
import { RepositoryTokens } from "../../../../../lib/injection-tokens/repository-tokens";
import { SpendingPlanRepositoryPort } from "../../../../../domain/repository/spending-plan.repository.port";

@Resolver
export class GetSpendingPlanResolver {
  constructor(
    @inject(RepositoryTokens.SpendingPlanRepository)
    private spendingPlanRepositoryPort: SpendingPlanRepositoryPort,
  ) {}

  async getSpendingPlan(
    _: unknown,
    __: unknown,
    context: GraphQLContext,
  ): Promise<SpendingPlan> {
    if (!context.currentUser) {
      throw new Error("No currentUser investigate Pls");
    }

    const spendingPlan =
      await this.spendingPlanRepositoryPort.findByUserAndMonth(
        context.currentUser.userId,
        new Date(),
      );

    return {
      allocation: spendingPlan.allocations,
      monthLabel: spendingPlan.monthLabel.toISOString().slice(0, 7),
      totalBudget: spendingPlan.totalBudget,
    };
  }
}
