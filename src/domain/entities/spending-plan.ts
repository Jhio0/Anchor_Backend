export interface SpendingPlan {
  id: string;
  userId: string;
  collectedExpenseId: string; // Links to source monthly application (for context/moneyLeft)
  monthLabel: Date; // Format: YYYY-MM
  totalBudget: number; // User's input: how much they WANT to spend this month (≤ moneyLeft)
  allocations?: {
    // Tracks spending by name/area
    name: string; // e.g., "Food", "Gas", "Entertainment"
    spent: number; // Running total spent in this area
  }[];
}
