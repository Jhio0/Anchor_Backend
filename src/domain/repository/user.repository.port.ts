import { User } from "../entities/user";
import { BaseRepositoryPort } from "myLibrary";

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Omit<User, "id">;

interface UserRepositoryPort extends Pick<
  BaseRepositoryPort<User, CreateUser, UpdateUser>,
  "create" | "delete" | "find" | "updateOne" | "findById"
> {
  findByEmail(email: string): Promise<User>;
}

export { UserRepositoryPort };
