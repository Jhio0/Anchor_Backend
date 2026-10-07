// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { DependencyRegistry } from 'myLibrary';
import { CollectedExpenseDataProviderAdapter } from '../../domain/provider/collected-expense-data.provider.adapter';
import { ApplicationProviderAdapter } from '../../domain/provider/application.provider.adapter';
import { SubmitInformationReviewNodeHandlerAdapter } from '../../domain/provider/node-handlers/submit-information-review-node-handler.provider.adapter';
import { SubmitIncomeNodeHandlerProviderAdapter } from '../../domain/provider/node-handlers/submit-income-node-handler.provider.adapter';
import { SubmitCollectedExpenseDataProviderAdapter } from '../../domain/provider/node-handlers/submit-collected-expense-data.provider.adapter';
import { AuthProviderAdapter } from '../../domain/provider/auth/auth.provider.adapter';

function registerProviders(this: DependencyRegistry): void {
  CollectedExpenseDataProviderAdapter;
  ApplicationProviderAdapter;
  SubmitInformationReviewNodeHandlerAdapter;
  SubmitIncomeNodeHandlerProviderAdapter;
  SubmitCollectedExpenseDataProviderAdapter;
  AuthProviderAdapter;
}

export { registerProviders };
