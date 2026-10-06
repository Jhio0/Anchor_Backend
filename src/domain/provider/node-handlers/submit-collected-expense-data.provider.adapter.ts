import { Provider } from "myLibrary";
import {
  handleExpenseNodeInput,
  SubmitCollectedExpenseDataProviderPort,
} from "./submit-collected-expense-data.provider.port";
import { ApplicationPayload } from "../../entities/application";
import { inject } from "tsyringe";
import { ProviderTokens } from "../../../lib/injection-tokens/provider-tokens";
import ApplicationProviderPort from "../application.provider.port";
import { ExpenseResolveInput } from "../../workflow/first_workflow/nodes/shared-node.type";

@Provider
export class SubmitCollectedExpenseDataProviderAdapter implements SubmitCollectedExpenseDataProviderPort {
  constructor(
    @inject(ProviderTokens.ApplicationProviderAdapter)
    private applicationProviderPort: ApplicationProviderPort,
  ) {}

  async handleExpenseNode(
    input: handleExpenseNodeInput,
  ): Promise<ApplicationPayload> {
    return await this.applicationProviderPort.submitScreen<ExpenseResolveInput>(
      input.applicationId,
      {
        items: input.items,
      },
    );
  }
}
