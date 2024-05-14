import Knex from 'knex';
import { types } from 'pg';
import parseTimestampTz from 'postgres-date';

const parseTimestampz = (val: string) => {
  const date = parseTimestampTz(val);
  if (!date || typeof date === 'number') { // The value is number when it is Infinity or -Infinity.
    return null;
  }
  return date.toISOString();
};
types.setTypeParser(types.builtins.TIMESTAMPTZ, parseTimestampz);

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: +(process.env.PORT!),
  },
  pool: {
    min: 2,
    max: 10,
  },
});

export default knex;
