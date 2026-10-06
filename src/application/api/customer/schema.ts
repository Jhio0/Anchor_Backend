export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ApplicationPayload = CollectIncomePayload | CompletedPayload | EssentialExpensePayload | FinancialLoanExpensePayload | InformationReviewPayload | SubscriptionExpensePayload;

export enum ApplicationScreen {
  CompletedScreen = 'CompletedScreen',
  EssentialExpenseScreen = 'EssentialExpenseScreen',
  FinancialLoanExpenseScreen = 'FinancialLoanExpenseScreen',
  IncomeDetailScreen = 'IncomeDetailScreen',
  InformationReviewScreen = 'InformationReviewScreen',
  SubscriptionExpenseScreen = 'SubscriptionExpenseScreen'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  sessionId: Scalars['String']['output'];
  user: User;
};

export type CollectIncomeApplicationInput = {
  applicationId: Scalars['ID']['input'];
  incomeAmount: Scalars['Float']['input'];
};

export type CollectIncomePayload = ScreenPayload & {
  __typename?: 'CollectIncomePayload';
  applicationId: Scalars['String']['output'];
  screen: ApplicationScreen;
};

export type CollectedExpenseData = {
  __typename?: 'CollectedExpenseData';
  applicationId: Scalars['ID']['output'];
  essentialItems: Array<CollectedExpenseItem>;
  financialItems: Array<CollectedExpenseItem>;
  income: Scalars['Float']['output'];
  moneyLeft: Scalars['Float']['output'];
  savingsRate: Scalars['Float']['output'];
  subscriptionItems: Array<CollectedExpenseItem>;
  totalExpense: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
};

export type CollectedExpenseItem = {
  __typename?: 'CollectedExpenseItem';
  amount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  source: CollectedExpenseSource;
};

export enum CollectedExpenseSource {
  ESSENTIALS = 'ESSENTIALS',
  FINANCIAL_LOAN = 'FINANCIAL_LOAN',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export type CompletedPayload = ScreenPayload & {
  __typename?: 'CompletedPayload';
  applicationId: Scalars['String']['output'];
  screen: ApplicationScreen;
};

export type EssentialExpensePayload = ScreenPayload & {
  __typename?: 'EssentialExpensePayload';
  applicationId: Scalars['String']['output'];
  screen: ApplicationScreen;
};

export type ExpenseApplicationInput = {
  applicationId: Scalars['ID']['input'];
  items: Array<ExpenseItemsInput>;
};

export type ExpenseItem = {
  __typename?: 'ExpenseItem';
  amount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  source: ExpenseSource;
};

export type ExpenseItemsInput = {
  amount: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  source: ExpenseSource;
};

export enum ExpenseSource {
  ESSENTIALS = 'ESSENTIALS',
  FINANCIAL_LOAN = 'FINANCIAL_LOAN',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export type FinancialLoanExpensePayload = ScreenPayload & {
  __typename?: 'FinancialLoanExpensePayload';
  applicationId: Scalars['String']['output'];
  screen: ApplicationScreen;
};

export type InformationReviewPayload = ScreenPayload & {
  __typename?: 'InformationReviewPayload';
  applicationId: Scalars['String']['output'];
  essentialItems: Array<ExpenseItem>;
  financialLoanItems: Array<ExpenseItem>;
  incomeAmount: Scalars['Float']['output'];
  screen: ApplicationScreen;
  subscriptionItems: Array<ExpenseItem>;
};

export type InformationReviewScreenInput = {
  applicationId: Scalars['ID']['input'];
  essentialItems?: InputMaybe<Array<ExpenseItemsInput>>;
  financialLoanItems?: InputMaybe<Array<ExpenseItemsInput>>;
  incomeAmount?: InputMaybe<Scalars['Float']['input']>;
  subscriptionItems?: InputMaybe<Array<ExpenseItemsInput>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createApplication: ApplicationPayload;
  createUser: User;
  signup: AuthPayload;
  submitCollectIncomeScreen: ApplicationPayload;
  submitExpenseScreen: ApplicationPayload;
  submitInformationReviewScreen: ApplicationPayload;
};


export type MutationcreateUserArgs = {
  dateOfBirth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationsignupArgs = {
  dateOfBirth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationsubmitCollectIncomeScreenArgs = {
  input: CollectIncomeApplicationInput;
};


export type MutationsubmitExpenseScreenArgs = {
  input: ExpenseApplicationInput;
};


export type MutationsubmitInformationReviewScreenArgs = {
  input: InformationReviewScreenInput;
};

export type Query = {
  __typename?: 'Query';
  collectedExpenseData: CollectedExpenseData;
  login: AuthPayload;
  me?: Maybe<User>;
  user: User;
};


export type QueryloginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
};

export type ScreenPayload = {
  applicationId: Scalars['String']['output'];
  screen: ApplicationScreen;
};

export type SubscriptionExpensePayload = ScreenPayload & {
  __typename?: 'SubscriptionExpensePayload';
  applicationId: Scalars['String']['output'];
  screen: ApplicationScreen;
};

export type User = {
  __typename?: 'User';
  dateOfBirth: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};
