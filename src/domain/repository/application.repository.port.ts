import { Application } from "../entities/application";
import { BaseRepositoryPort } from "myLibrary";

export type CreateApplication = Omit<Application, "id">;
export type UpdateApplication = Omit<Application, "id" | "userId">;

interface ApplicationRepositoryPort extends Pick<
  BaseRepositoryPort<Application, CreateApplication, UpdateApplication>,
  "create" | "delete" | "find" | "updateOne" | "findById"
> {
  findByUserId(userId: string): Promise<Application[]>;
}

export { ApplicationRepositoryPort };
