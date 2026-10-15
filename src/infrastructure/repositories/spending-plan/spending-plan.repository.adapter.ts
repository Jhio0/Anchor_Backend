import { Repository, BaseRepository } from "myLibrary";
import { SpendingPlan } from "../../../domain/entities/spending-plan";
import {
  CreateSpendingPlan,
  UpdateSpendingPlan,
  SpendingPlanRepositoryPort,
} from "../../../domain/repository/spending-plan.repository.port";
import spendingPlanSchema, {
  SpendingPlanDocument,
} from "./spending-plan.schema";

@Repository("SpendingPlan", spendingPlanSchema)
class SpendingPlanRepositoryAdapter
  extends BaseRepository<
    SpendingPlanDocument,
    SpendingPlan,
    CreateSpendingPlan,
    UpdateSpendingPlan
  >
  implements SpendingPlanRepositoryPort
{
  async findByUserAndMonth(
    userId: string,
    monthLabel: Date,
  ): Promise<SpendingPlan> {
    const startOfMonth = new Date(
      Date.UTC(monthLabel.getUTCFullYear(), monthLabel.getUTCMonth(), 1),
    );

    const startOfNextMonth = new Date(
      Date.UTC(monthLabel.getUTCFullYear(), monthLabel.getUTCMonth() + 1, 1),
    );

    const document = await this.model
      .findOne({
        userId,
        monthLabel: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      })
      .exec();

    if (!document) {
      throw new Error("Spending plan not found for this month");
    }

    return this.toObject(document);
  }

  protected toObject(document: SpendingPlanDocument): SpendingPlan {
    return {
      id: document._id.toHexString(),
      userId: document.userId,
      collectedExpenseId: document.collectedExpenseId,
      monthLabel: document.monthLabel,
      totalBudget: document.totalBudget,
      allocations: (document.allocations ?? []).map((alloc) => ({
        name: alloc.name,
        spent: alloc.spent,
      })),
    };
  }
}

export { SpendingPlanRepositoryAdapter };
