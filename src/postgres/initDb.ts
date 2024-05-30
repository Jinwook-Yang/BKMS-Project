import { UsersModel } from 'models/users';
import knex from './connection';
import { SettingsModel } from 'models/settings';

const connectDb = async () => {
  await UsersModel.createTableIfNotExists();
  await SettingsModel.createTableIfNotExists();
  console.log('Table creation complete');

  const admin = await UsersModel.create({
    userEmail: 'admin',
    userName: 'admin',
    password: 'admin',
  });
  await SettingsModel.create({
    userId: admin[0].id,
    isAdmin: true,
  });
};

export default connectDb;
