import knex from './connection';

const DB_CONNECT_TIMEOUT = 2 * 60 * 1000;
const connectDb = async () => {
  const start = Date.now();
  let connected = false;
  console.log('Connecting to DB...');
  while (!connected && Date.now() - start < DB_CONNECT_TIMEOUT) {
    await knex.raw('SELECT 1') // eslint-disable-line no-await-in-loop
      .then(() => { connected = true; }) // eslint-disable-line no-loop-func
      .catch(() => new Promise((resolve) => setTimeout(resolve, 5000)));
  }
  if (connected) {
    console.log('connected');
  } else {
    // Do select again to propagate the error to the caller of initServer.
    await knex.raw('SELECT 1');
  }
};

export default connectDb;
