// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { DependencyRegistry, createMongoose, instanceCachingFactory } from 'myLibrary';
import config from "config-dug";
import { Mongoose } from "mongoose";
import { UserRepositoryAdapter } from '../../infrastructure/repositories/user/user.repository.adapter';
import { CollectedExpenseRepositoryAdapter } from '../../infrastructure/repositories/collected-expense-data/collected-expense-data.repository.adapter';
import { ApplicationRepositoryAdapter } from '../../infrastructure/repositories/application/application.repository.adapter';

function registerRepositorys(this: DependencyRegistry): void { this.container.register(Mongoose, {
    useFactory: instanceCachingFactory(() =>
      createMongoose(process.env.MONGODB_URI as string)
    ),
  });
  UserRepositoryAdapter;
  CollectedExpenseRepositoryAdapter;
  ApplicationRepositoryAdapter;
}

export { registerRepositorys };
