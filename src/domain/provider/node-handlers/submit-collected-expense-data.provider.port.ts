import { ApplicationPayload } from "../../entities/application";
import { ExpenseItems } from "../../entities/collected-expsense-data";

export type handleExpenseNodeInput = {
  applicationId: string;
  items: ExpenseItems[];
};

export interface SubmitCollectedExpenseDataProviderPort {
  handleExpenseNode(input: handleExpenseNodeInput): Promise<ApplicationPayload>;
}
