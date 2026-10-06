import { Provider } from "myLibrary";
import { ProviderTokens } from "../../../lib/injection-tokens/provider-tokens";
import { inject } from "../../../lib/strict-inject";

import ApplicationProviderPort from "../application.provider.port";
import SubmitIncomeNodeHandlerProviderPort, {
  handleIncomeNodeHandlerInput,
} from "./submit-income-node-handler.provider.port";
import {
  ApplicationPayload,
  ApplicationScreen,
} from "../../entities/application";
import { CollectIncomeResolveInput } from "../../workflow/first_workflow/nodes/collect-income.node";

@Provider
export class SubmitIncomeNodeHandlerProviderAdapter implements SubmitIncomeNodeHandlerProviderPort {
  constructor(
    @inject(ProviderTokens.ApplicationProviderAdapter)
    private applicationProviderPort: ApplicationProviderPort,
  ) {}

  async handleIncomeNodeHandler(
    input: handleIncomeNodeHandlerInput,
  ): Promise<ApplicationPayload> {
    if (input.incomeAmount < 0) {
      throw new Error("Income cannot be negative");
    }

    const screen =
      await this.applicationProviderPort.submitScreen<CollectIncomeResolveInput>(
        input.applicationId,
        { incomeAmount: input.incomeAmount },
      );

    return screen;
  }
}
