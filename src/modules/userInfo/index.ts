import { UsersModel } from 'models/users';
import knex from 'postgres/connection'

const getUserInfo = async (userId: number) => {
  const userInfo = await UsersModel.findById(userId);
  console.log('User Email: ', userInfo.user_email);
  console.log('User Name: ', userInfo.user_name);
  const result = await knex.raw(`
    SELECT * FROM users
    JOIN ratings ON users.id = ratings.user_id
    JOIN movies ON ratings.movie_id = movies.id
    WHERE users.id = ${userId};
  `);
  if (result.rows.length === 0) {
    console.log('No rated movies');
    return;
  }
  console.log('### Rated Movies ###');
  for (let i = 0; i < result.rows.length; i++) {
    console.log(`Title: ${result.rows[i].title}, Rating: ${result.rows[i].rating}`);
  }
  console.log('### End ###');
  return;
}

export default getUserInfo;
