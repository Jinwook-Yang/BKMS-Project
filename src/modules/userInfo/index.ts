import { UsersModel } from 'models/users';
import knex from 'postgres/connection'

const getUserInfo = async (userId: number) => {
  const userInfo = await UsersModel.findById(userId);
  console.log('User Email: ', userInfo.user_email);
  console.log('User Name: ', userInfo.user_name);
  const resultRatings = await knex.raw(`
    SELECT * FROM users
    JOIN ratings ON users.id = ratings.user_id
    JOIN movies ON ratings.movie_id = movies.id
    WHERE users.id = ${userId};
  `);
  const resultTags = await knex.raw(`
    SELECT * FROM users
    JOIN tags ON users.id = tags.user_id
    JOIN movies ON tags.movie_id = movies.id
    WHERE users.id = ${userId};
  `);
  const tagsMap = new Map();
  for (let i = 0; i < resultTags.rows.length; i++) {
    tagsMap.set(resultTags.rows[i].movie_id, resultTags.rows[i]);
  }
  const result = [];
  for (let i = 0; i < resultRatings.rows.length; i++) {
    if (tagsMap.has(resultRatings.rows[i].movie_id)) {
      result.push({
        title: resultRatings.rows[i].title,
        rating: resultRatings.rows[i].rating,
        tag: tagsMap.get(resultRatings.rows[i].movie_id).tag,
      });
      tagsMap.delete(resultRatings.rows[i].movie_id);
    } else {
      result.push({
        title: resultRatings.rows[i].title,
        rating: resultRatings.rows[i].rating,
        tag: null,
      });
    }
  }
  for (let [key, value] of tagsMap) {
    result.push({
      title: value.title,
      rating: null,
      tag: value.tag,
    });
  }


  if (result.length === 0) {
    console.log('No rated movies');
    return;
  }
  console.log('### Rated Movies ###');
  for (let i = 0; i < result.length; i++) {
    console.log(`Title: ${result[i].title}, Rating: ${result[i].rating || 'not rated'}, Tag: ${result[i].tag || 'no tag'}`);
  }
  console.log('### End ###');
  return;
}

export default getUserInfo;
