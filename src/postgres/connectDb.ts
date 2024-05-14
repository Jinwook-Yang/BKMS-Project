import { UsersModel } from 'models/users';
import knex from './connection';

const connectDb = async () => {
  const start = Date.now();
  let connected = false;
  console.log('Connecting to DB');
  while (!connected && Date.now() - start < 2 * 60 * 1000) {
    await knex.raw('SELECT 1')
      .then(() => { connected = true; })
      .catch(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  }
  console.log('DB Connected');
  console.log('Creating table if not exists');
  await UsersModel.createTableIfNotExists();
  console.log('Table creation complete');
};

export default connectDb;
