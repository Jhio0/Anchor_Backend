import { GraphQLContext, Resolver } from "myLibrary";
import { inject } from "../../../../../lib/strict-inject";

import { CollectedExpenseData } from "../../../../../domain/entities/collected-expsense-data";
import { RepositoryTokens } from "../../../../../lib/injection-tokens/repository-tokens";
import { CollectedExpenseRepositoryPort } from "../../../../../domain/repository/collected-expense-data.repository.port";

@Resolver
export class GetCollectedExpenseQueryResolver {
  constructor(
    @inject(RepositoryTokens.CollectedExpenseDataRepository)
    private collectedExpenseRepositoryPort: CollectedExpenseRepositoryPort,
  ) {}

  async collectedExpenseData(
    _: unknown,
    __: unknown,
    context: GraphQLContext,
  ): Promise<CollectedExpenseData> {
    if (!context.currentUser) {
      throw new Error("No currentUser investigate Pls");
    }

    const result = await this.collectedExpenseRepositoryPort.findByUserId(
      context.currentUser.userId,
    );

    return result;
  }
}
