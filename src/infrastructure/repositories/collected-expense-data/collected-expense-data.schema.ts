import { Schema, Document } from "mongoose";
import { CollectedExpenseData } from "../../../domain/entities/collected-expsense-data";
import { ExpenseSource } from "../../../domain/entities/collected-expsense-data";

export interface CollectedExpenseDataDocument
  extends Document, Omit<CollectedExpenseData, "id"> {}

const expenseItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: Object.values(ExpenseSource),
      required: true,
    },
  },
  { _id: false },
);

const collectedExpenseDataSchema = new Schema<CollectedExpenseDataDocument>({
  userId: {
    type: String,
    required: true,
  },
  applicationId: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  totalExpense: {
    type: Number,
    required: true,
  },
  moneyLeft: {
    type: Number,
    required: true,
  },
  savingsRate: {
    type: Number,
    required: true,
  },
  essentialItems: {
    type: [expenseItemSchema],
    required: true,
  },
  financialItems: {
    type: [expenseItemSchema],
    required: true,
  },
  subscriptionItems: {
    type: [expenseItemSchema],
    required: true,
  },
});

export default collectedExpenseDataSchema;
