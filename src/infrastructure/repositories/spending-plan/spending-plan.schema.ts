import { Schema, Document } from "mongoose";
import { SpendingPlan } from "../../../domain/entities/spending-plan";

export interface SpendingPlanDocument
  extends Document, Omit<SpendingPlan, "id"> {}

const allocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    spent: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

const spendingPlanSchema = new Schema<SpendingPlanDocument>({
  userId: {
    type: String,
    required: true,
  },
  collectedExpenseId: {
    type: String,
    required: true,
  },
  monthLabel: {
    type: Date,
    required: true,
  },
  totalBudget: {
    type: Number,
    required: true,
  },
  allocations: {
    type: [allocationSchema],
    required: false,
  },
});

export default spendingPlanSchema;
