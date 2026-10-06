import { ApplicationPayload } from "../../entities/application";
import { ExpenseItems } from "../../entities/collected-expsense-data";

export type HandleInformationReviewNodeInput = {
  applicationId: string;
  incomeAmount?: number;
  essentialItems?: ExpenseItems[];
  financialLoanItems?: ExpenseItems[];
  subscriptionItems?: ExpenseItems[];
};

export interface SubmitInformationReviewNodeHandlerPort {
  handleInformationReviewNode(
    input: HandleInformationReviewNodeInput,
  ): Promise<ApplicationPayload>;
}
