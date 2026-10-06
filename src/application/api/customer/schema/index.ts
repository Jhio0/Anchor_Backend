import "reflect-metadata";

import { applicationSchema } from "./application.schema";
import { authSchema } from "./auth.schema";
import { userSchema } from "./user.schema";
import { collectedExpenseSchema } from "./collected-expense-data.schema";

export const typeDefs = [
  userSchema,
  authSchema,
  applicationSchema,
  collectedExpenseSchema,
];
