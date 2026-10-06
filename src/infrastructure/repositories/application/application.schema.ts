import { Schema, Document } from "mongoose";
import {
  Application,
  ApplicationStatus,
} from "../../../domain/entities/application";
import workflowSchema from "./schema/workflow.schema";

export interface ApplicationDocument
  extends Document, Omit<Application, "id"> {}

const ApplicationSchema = new Schema({
  id: { type: String, require: true },
  userId: { type: String, require: true },
  workflowContext: workflowSchema,
  screen: { type: String, require: true },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    require: true,
  },
  submittedAt: { type: Date, require: false },
});

export default ApplicationSchema;
