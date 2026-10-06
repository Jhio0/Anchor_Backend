export enum ExpenseSource {
  ESSENTIALS = "ESSENTIALS",
  FINANCIAL_LOAN = "FINANCIAL_LOAN",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export type ExpenseItems = {
  name: string;
  amount: number;
  source: ExpenseSource;
};

export interface CollectedExpenseData {
  id: string;
  userId: string;
  applicationId: string;
  income: number;
  totalExpense: number;
  moneyLeft: number;
  savingsRate: number;
  essentialItems: ExpenseItems[];
  financialItems: ExpenseItems[];
  subscriptionItems: ExpenseItems[];
}
