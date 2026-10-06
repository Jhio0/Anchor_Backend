import { buildResolvers } from "myLibrary";
import { CreateApplicationMutationResolver } from "./mutation/createApplication.mutation.resolver";
import { SubmitExpenseScreenMutationResolver } from "./mutation/submit-screens/submit-expense-screen.mutation.resolver";
import { SubmitIncomeScreenMutationResolver } from "./mutation/submit-screens/submit-income-screen.mutation.resolver";
import { UserAuthMutationResolver } from "./userAuth/userAuth.mutation.resolver";
import { UserAuthQueryResolver } from "./userAuth/userAuth.query.resolver";
import { ApplicationPayload } from "./mutation/submit-screens/mapper/application-payload.mapper";
import { SubmitInformationReviewScreenMutationResolver } from "./mutation/submit-screens/submit-information-review.mutation.resolver";
import { GetCollectedExpenseQueryResolver } from "./query/getCollectedExpenseData.resolver";

export function createResolvers() {
  const resolvers = buildResolvers({
    Query: [UserAuthQueryResolver, GetCollectedExpenseQueryResolver],
    Mutation: [
      CreateApplicationMutationResolver,
      SubmitExpenseScreenMutationResolver,
      SubmitIncomeScreenMutationResolver,
      SubmitInformationReviewScreenMutationResolver,
      UserAuthMutationResolver,
    ],
  });

  return {
    ...resolvers,
    ApplicationPayload, // manually attach the union's __resolveType
  };
}
