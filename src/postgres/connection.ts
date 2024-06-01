import Knex from 'knex';
import { types } from 'pg';
import parseTimestampTz from 'postgres-date';
import dotenv from 'dotenv';

dotenv.config();

// Check the value is timestamp and format it to postgres.
const parseTimestampz = (val: string) => {
  const date = parseTimestampTz(val);
  if (!date || typeof date === 'number') { // The value is number when it is Infinity or -Infinity.
    return null;
  }
  return date.toISOString();
};
types.setTypeParser(types.builtins.TIMESTAMPTZ, parseTimestampz);

// Use knex to add connection for the database.
const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: +(process.env.PORT!),
  },
  pool: {
    min: 1,
    max: 10,
  },
});

export default knex;
