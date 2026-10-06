import { Model, QueryFilter, UpdateQuery, Document } from "mongoose";

//Define generic types to make the wrapper reusable for any domain object
export type CreateInput = Partial<Document>;
export type UpdateInput = UpdateQuery<Document>;
export type QueryInput = QueryFilter<Document>;
export type DomainObject = any;

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

//A utility function to get the keys with undefined values from an object, which is useful for getting those fields
//to null during an update operation

const getFieldsToNull = (update: UpdateInput): object => {
  const fieldsToNull: { [key: string]: null } = {};
  for (const key in update) {
    if (update[key] === undefined) {
      fieldsToNull[key] = null;
    }
  }
  return fieldsToNull;
};

export abstract class BaseRepository<
  MongooseDocument extends Document,
  DomainObject,
  CreateInput extends Partial<MongooseDocument>,
  UpdateInput extends UpdateQuery<MongooseDocument>,
  QueryInput extends object = DefaultQueryInput<MongooseDocument>,
> implements BaseRepositoryPort<
  DomainObject,
  CreateInput,
  UpdateInput,
  QueryInput
> {
  protected model: Model<MongooseDocument>;

  // The Mongoose model is injected via decorator as `{ model, options }`.
  constructor(args: {
    model: Model<MongooseDocument>;
    options?: { onUpdateSetUndefinedToNull?: boolean };
  }) {
    this.model = args.model;
  }

  //converts a raw Mongoose Document into a clean domainObject this is an abstract methods that must be implemented

  protected abstract toObject(document: MongooseDocument): DomainObject;

  // Optional method to convert a domain object back into a format suitable for Mongoose updates. the default implementation simply returns a object as is

  protected toDocument(object: UpdateInput): UpdateQuery<MongooseDocument> {
    return object;
  }

  //wrapper CRUD METHODS

  public async create(createInput: CreateInput): Promise<DomainObject> {
    const document = await this.model.create(createInput);
    return this.toObject(document);
  }

  public async find(query: QueryFilter<Document>): Promise<DomainObject[]> {
    const documents = await this.model.find(query);
    return documents.map((s) => this.toObject(s));
  }

  public async findById(id: string): Promise<DomainObject> {
    const document = await this.model.findById(id).exec();
    if (!document) {
      throw new Error(`Resource with id ${id} not found`);
    }
    return this.toObject(document);
  }

  public async updateOne(
    id: string,
    update: UpdateInput,
  ): Promise<DomainObject> {
    const document = await this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...this.toDocument(update),
            ...getFieldsToNull(update),
          },
        },
        { new: true, runValidators: true },
      )
      .exec();
    if (!document) {
      throw new Error(`Resource with id ${id} is not found for update`);
    }

    return this.toObject(document);
  }

  public async delete(id: string): Promise<boolean> {
    const document = await this.model
      .deleteOne({ _id: id } as QueryFilter<MongooseDocument>)
      .exec();
    return document.deletedCount > 0;
  }
}
