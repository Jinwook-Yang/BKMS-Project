import knex from 'postgres/connection'

const getUserInfo = async (userId: number) => {
  const result = await knex.raw(`
    SELECT * FROM users
    JOIN ratings ON users.id = ratings.user_id
    JOIN movies ON ratings.movie_id = movies.id
    WHERE users.id = ${userId};
  `);
  console.log('User Email: ', result.rows[0].user_email);
  console.log('User Name: ', result.rows[0].user_name);
  console.log('### Rated Movies ###');
  for (let i = 0; i < result.rows.length; i++) {
    console.log(`Title: ${result.rows[i].title}, Rating: ${result.rows[i].rating}`);
  }
  console.log('### End ###');
  return;
}

export default getUserInfo;
