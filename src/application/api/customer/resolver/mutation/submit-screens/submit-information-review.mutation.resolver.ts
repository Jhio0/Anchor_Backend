import { enumFromKeyStringThrow, GraphQLContext, Resolver } from "myLibrary";
import {
  ApplicationPayload,
  InformationReviewScreenInput,
} from "../../../schema";
import { inject } from "../../../../../../lib/strict-inject";
import { ProviderTokens } from "../../../../../../lib/injection-tokens/provider-tokens";
import { SubmitInformationReviewNodeHandlerPort } from "../../../../../../domain/provider/node-handlers/submit-information-review-node-handler.provider.port";
import {
  ExpenseItems,
  ExpenseSource,
} from "../../../../../../domain/entities/collected-expsense-data";
import { buildApplicationPayload } from "./mapper/application-payload.mapper";

@Resolver
export class SubmitInformationReviewScreenMutationResolver {
  constructor(
    @inject(ProviderTokens.SubmitInformationReviewNodeHandlerAdapter)
    private submitInformationReviewNodeHandlerPort: SubmitInformationReviewNodeHandlerPort,
  ) {}

  async submitInformationReviewScreen(
    _: unknown,
    args: { input: InformationReviewScreenInput },
    context: GraphQLContext,
  ): Promise<ApplicationPayload> {
    const {
      essentialItems,
      financialLoanItems,
      subscriptionItems,
      applicationId,
    } = args.input;

    const screen =
      await this.submitInformationReviewNodeHandlerPort.handleInformationReviewNode(
        {
          applicationId,
          incomeAmount: Number(args.input.incomeAmount),
          essentialItems: this.#mapExpenseItems(essentialItems),
          financialLoanItems: this.#mapExpenseItems(financialLoanItems),
          subscriptionItems: this.#mapExpenseItems(subscriptionItems),
        },
      );

    return buildApplicationPayload(screen);
  }

  #mapExpenseItems(
    items?: InformationReviewScreenInput["essentialItems"],
  ): ExpenseItems[] | undefined {
    return items?.map((item) => ({
      name: item.name,
      amount: item.amount,
      source: enumFromKeyStringThrow(ExpenseSource, item.source),
    }));
  }
}
