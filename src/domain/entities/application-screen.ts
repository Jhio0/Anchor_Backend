import { invertMap } from "myLibrary";
import { CollectIncomeNode } from "../workflow/first_workflow/nodes/collect-income.node";
import { ApplicationScreen } from "./application";
import { EssentialExpenseNode } from "../workflow/first_workflow/nodes/essential-expense-node";
import { FinancialLoanExpenseNode } from "../workflow/first_workflow/nodes/financial-loan-expense-node";
import { SubscriptionExpenseNode } from "../workflow/first_workflow/nodes/subscription-expense-node";
import { InformationReviewNode } from "../workflow/first_workflow/nodes/information-review.node";

export const screenToNodeId: Record<ApplicationScreen, string> = {
  [ApplicationScreen.IncomeDetailScreen]: CollectIncomeNode.NODE_ID,
  [ApplicationScreen.EssentialExpenseScreen]: EssentialExpenseNode.NODE_ID,
  [ApplicationScreen.FinancialLoanExpenseScreen]:
    FinancialLoanExpenseNode.NODE_ID,
  [ApplicationScreen.SubscriptionExpenseScreen]:
    SubscriptionExpenseNode.NODE_ID,
  [ApplicationScreen.InformationReviewScreen]: InformationReviewNode.NODE_ID,
  [ApplicationScreen.CompletedScreen]: "asdsa",
};

export const nodeIdToScreen: Record<string, ApplicationScreen> =
  invertMap(screenToNodeId);
