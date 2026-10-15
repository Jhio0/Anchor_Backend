import { Provider } from "myLibrary";
import {
  CreateSpendingPlanInput,
  SpendingPlanProviderPort,
} from "./spending-plan.provider.port";
import { SpendingPlan } from "../entities/spending-plan";
import { inject } from "tsyringe";
import { RepositoryTokens } from "../../lib/injection-tokens/repository-tokens";
import { SpendingPlanRepositoryPort } from "../repository/spending-plan.repository.port";
import { CollectedExpenseRepositoryPort } from "../repository/collected-expense-data.repository.port";
import { ProviderTokens } from "../../lib/injection-tokens/provider-tokens";
import { CollectedExpenseDataProviderPort } from "./collected-expense-data.provider.port";

@Provider
export class SpendingPlanProviderAdapter implements SpendingPlanProviderPort {
  constructor(
    @inject(RepositoryTokens.SpendingPlanRepository)
    private spendingPlanRepositoryPort: SpendingPlanRepositoryPort,
    @inject(ProviderTokens.CollectedExpenseDataProviderAdapter)
    private collectedExpenseDataProviderPort: CollectedExpenseDataProviderPort,
  ) {}

  async createSpendingPlan(
    input: CreateSpendingPlanInput,
  ): Promise<SpendingPlan> {
    const spendingPlan = await this.spendingPlanRepositoryPort.create({
      userId: input.userId,
      collectedExpenseId: input.collectedExpenseId,
      monthLabel: input.monthLabel,
      totalBudget: input.totalBudget,
    });

    await this.collectedExpenseDataProviderPort.updateExpenseSummary({
      collectedExpenseId: input.collectedExpenseId,
      totalBudget: spendingPlan.totalBudget,
    });

    return spendingPlan;
  }
}
