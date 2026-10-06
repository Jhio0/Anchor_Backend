import { QueryFilter, UpdateQuery, Document, Model } from "mongoose";

// You can import DefaultQueryInput if you have it, or define a fallback:
export type DefaultQueryInput<T> = QueryFilter<T>;

export interface BaseRepositoryPort<
  DomainObject,
  CreateInput,
  UpdateInput,
  QueryInput = DefaultQueryInput<DomainObject>,
> {
  create(input: CreateInput): Promise<DomainObject>;
  find(query: QueryInput): Promise<DomainObject[]>;
  findById(id: string): Promise<DomainObject>;
  updateOne(id: string, update: UpdateInput): Promise<DomainObject>;
  delete(id: string): Promise<boolean>;
}

export declare abstract class BaseRepository<
  MongooseDocument extends Document,
  DomainObject,
  CreateInput,
  UpdateInput extends UpdateQuery<MongooseDocument>,
  QueryInput extends object = DefaultQueryInput<MongooseDocument>,
> implements BaseRepositoryPort<
  DomainObject,
  CreateInput,
  UpdateInput,
  QueryInput
> {
  protected model: Model<MongooseDocument>;
  constructor(model: Model<MongooseDocument>);
  protected abstract toObject(document: MongooseDocument): DomainObject;
  protected toDocument(object: UpdateInput): UpdateQuery<MongooseDocument>;
  create(createInput: CreateInput): Promise<DomainObject>;
  find(query: QueryFilter<MongooseDocument>): Promise<DomainObject[]>;
  findById(id: string): Promise<DomainObject>;
  updateOne(id: string, update: UpdateInput): Promise<DomainObject>;
  delete(id: string): Promise<boolean>;
}
