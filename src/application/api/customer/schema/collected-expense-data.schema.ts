import { gql } from "apollo-server";

import { getEnumList } from "myLibrary";
import { ExpenseSource } from "../../../../domain/entities/collected-expsense-data";

export const collectedExpenseSchema = gql`
  enum CollectedExpenseSource {
    ${getEnumList(ExpenseSource)}
  }

  type CollectedExpenseItem {
    name: String!
    amount: Float!
    source: CollectedExpenseSource!
  }

  input CollectedExpenseItemInput {
    name: String!
    amount: Float!
  }


  type CollectedExpenseData {
    userId: ID!
    applicationId: ID!
    income: Float!
    totalExpense: Float!
    moneyLeft: Float!
    savingsRate: Float!
    essentialItems: [CollectedExpenseItem!]!
    financialItems: [CollectedExpenseItem!]!
    subscriptionItems: [CollectedExpenseItem!]!
  }

  input UpdateCollectedExpenseItemsInput {
    category: CollectedExpenseSource!
    items: [CollectedExpenseItemInput!]!
  }

  type Query {
    collectedExpenseData: CollectedExpenseData!
  }

  type Mutation {
    updateCollectedExpenseItems(input: UpdateCollectedExpenseItemsInput): Boolean!
  }
`;
