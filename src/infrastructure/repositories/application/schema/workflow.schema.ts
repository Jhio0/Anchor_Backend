import { Schema } from "mongoose";

const workflowSchema = new Schema(
  {
    id: { type: String, require: true },
    context: { type: Schema.Types.Mixed, require: true },
    currentNodeId: { type: String, require: true },
  },
  { _id: false },
);

export default workflowSchema;
