import { Schema, Document } from "mongoose";
import { User } from "../../../domain/entities/user";

export interface UserDocument extends Document, Omit<User, "id"> {}

const userSchema = new Schema(
  {
    id: { type: String, require: true },
    name: { type: String, require: true },
    dateOfBirth: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
  },
  { timestamps: true },
);

export default userSchema;
