import knex from 'postgres/connection';

// Display information about the system.
const about = async () => {
  console.log('This is a simple movie rating system.');
  const userCount = (await knex.raw('SELECT COUNT(id) as count FROM users;')).rows[0].count;
  const movieCount = (await knex.raw('SELECT COUNT(id) as count FROM movies;')).rows[0].count;
  console.log(`Total users: ${userCount}`);
  console.log(`Total movies: ${movieCount}`);
}

export default about;
