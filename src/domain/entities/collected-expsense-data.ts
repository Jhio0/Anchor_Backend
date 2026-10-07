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

export type CollectedExpenseItems = {
  essentialItems: ExpenseItems[];
  financialItems: ExpenseItems[];
  subscriptionItems: ExpenseItems[];
};

export interface CollectedExpenseData extends CollectedExpenseItems {
  id: string;
  userId: string;
  applicationId: string;
  income: number;
  totalExpense: number;
  moneyLeft: number;
  savingsRate: number;
}
