import z from "zod";
import { ExpenseSource } from "../../../entities/collected-expsense-data";

export const noInputSchema = z.object({});

export const ExpenseItemSchema = z.object({
  name: z.string(),
  amount: z.number(),
  source: z.enum(ExpenseSource),
});

export const ExpenseResolveInputSchema = z.object({
  items: z.array(ExpenseItemSchema),
});

export type ExpenseResolveInput = z.infer<typeof ExpenseResolveInputSchema>;
