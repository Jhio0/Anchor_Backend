import { gql } from "apollo-server";

import { getEnumList } from "myLibrary";
import { ApplicationScreen } from "../../../../domain/entities/application";
import { ExpenseSource } from "../../../../domain/entities/collected-expsense-data";

export const applicationSchema = gql`
  enum ApplicationScreen {
    ${getEnumList(ApplicationScreen)}
  }

  enum ExpenseSource {
    ${getEnumList(ExpenseSource)}
  }

  type ExpenseItem {
    name: String!
    amount: Float!
    source: ExpenseSource!
  }

  interface ScreenPayload {
    applicationId: String!
    screen: ApplicationScreen!
  }

  type CollectIncomePayload implements ScreenPayload {
    applicationId: String!
    screen: ApplicationScreen!
  }

  type EssentialExpensePayload implements ScreenPayload {
    applicationId: String!
    screen: ApplicationScreen!
  }

  type FinancialLoanExpensePayload implements ScreenPayload { 
    applicationId: String!
    screen: ApplicationScreen!
  }

  type SubscriptionExpensePayload implements ScreenPayload {
    applicationId: String!
    screen: ApplicationScreen!
  }

  type InformationReviewPayload implements ScreenPayload {
    applicationId: String!
    screen: ApplicationScreen!
    incomeAmount: Float!
    essentialItems: [ExpenseItem!]!
    financialLoanItems: [ExpenseItem!]!
    subscriptionItems: [ExpenseItem!]!
  }

  type CompletedPayload implements ScreenPayload {
    applicationId: String!
    screen: ApplicationScreen!
  }

  union ApplicationPayload =
      CollectIncomePayload
    | EssentialExpensePayload
    | FinancialLoanExpensePayload
    | SubscriptionExpensePayload
    | InformationReviewPayload
    | CompletedPayload

  input ExpenseItemsInput {
    name: String!
    amount: Float!
    source: ExpenseSource!
  }

  input CollectIncomeApplicationInput {
    applicationId: ID!
    incomeAmount: Float!
  }
  
  input ExpenseApplicationInput {
    applicationId: ID!
    items: [ExpenseItemsInput!]!
  }

  input InformationReviewScreenInput {
    applicationId: ID!
    incomeAmount: Float
    essentialItems: [ExpenseItemsInput!]
    financialLoanItems: [ExpenseItemsInput!]
    subscriptionItems: [ExpenseItemsInput!]
  }

  type Mutation {
    createApplication: ApplicationPayload!
    submitCollectIncomeScreen(input: CollectIncomeApplicationInput!): ApplicationPayload!
    submitExpenseScreen(input: ExpenseApplicationInput!): ApplicationPayload!
    submitInformationReviewScreen(input: InformationReviewScreenInput!): ApplicationPayload!
  }
`;
