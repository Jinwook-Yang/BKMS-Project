import { UsersModel } from 'models/users';
import knex from './connection';
import initDb from './initDb';


// Start Connection to DB
// Check connection and create table if not exists.
const connectDb = async () => {
  const start = Date.now();
  let connected = false;
  console.log('Connecting to DB');
  // Try connection by SELECT 1. If not connected, wait for connection.
  // If connection is not made for 2 minutes, close server.
  while (!connected && Date.now() - start < 2 * 60 * 1000) {
    await knex.raw('SELECT 1')
      .then(() => { connected = true; })
      .catch(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  }
  // Exit server if the connection is not made.
  if (!connected) {
    console.log('DB Connection failed. Closing server.');
    process.exit(1);
  }
  console.log('DB Connected');
  console.log('Creating table if not exists');
  // Create tables if it does not exists on DB.
  await initDb();
  console.log('Table creation complete');
};

export default connectDb;
