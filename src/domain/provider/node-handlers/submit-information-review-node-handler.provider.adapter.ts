import { Provider } from "myLibrary";
import {
  HandleInformationReviewNodeInput,
  SubmitInformationReviewNodeHandlerPort,
} from "./submit-information-review-node-handler.provider.port";
import { ApplicationPayload } from "../../entities/application";
import { inject } from "tsyringe";
import { ProviderTokens } from "../../../lib/injection-tokens/provider-tokens";
import ApplicationProviderPort from "../application.provider.port";
import { InformationReviewResolveInput } from "../../workflow/first_workflow/nodes/information-review.node";

@Provider
export class SubmitInformationReviewNodeHandlerAdapter implements SubmitInformationReviewNodeHandlerPort {
  constructor(
    @inject(ProviderTokens.ApplicationProviderAdapter)
    private applicationProviderPort: ApplicationProviderPort,
  ) {}

  async handleInformationReviewNode(
    input: HandleInformationReviewNodeInput,
  ): Promise<ApplicationPayload> {
    return await this.applicationProviderPort.submitScreen(
      input.applicationId,
      {
        applicationId: input.applicationId,
        incomeAmount: input.incomeAmount,
        essentialItems: input.essentialItems,
        financialLoanItems: input.financialLoanItems,
        subscriptionItems: input.subscriptionItems,
      },
    );
  }
}
