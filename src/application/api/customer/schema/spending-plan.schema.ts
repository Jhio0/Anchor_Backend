import { gql } from "apollo-server";

export const spendingPlanSchema = gql`
  type Allocation {
    name: String!
    spent: Float!
  }

  type SpendingPlan {
    monthLabel: String!
    totalBudget: Float!
    allocation: [Allocation]
  }

  input CreateSpendingPlanInput {
    collectedExpenseId: String!
    amount: Float!
  }

  type Query {
    getSpendingPlan: SpendingPlan!
  }

  type Mutation {
    createSpendingPlan(input: CreateSpendingPlanInput!): SpendingPlan!
  }
`;
