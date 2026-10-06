import { Schema } from "mongoose";
import { ExpenseSource } from "../../../../domain/entities/collected-expsense-data";

export const expenseItemSchema = new Schema(
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
