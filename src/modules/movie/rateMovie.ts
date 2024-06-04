import { RatingsModel } from 'models/ratings';
import { question } from 'modules/utils';
import knex from 'postgres/connection';
import * as readline from 'readline';

const questionRate = async (rl: readline.Interface) => await question(
  rl, `Enter rate for the movie (1 / 2 / 3 / 4 / 5 / exit): `,
);

const questionYesOrNo = async (rl: readline.Interface, rate: number) => await question(
  rl, `Do you really want to rate this movie ${rate} (yes / no): `,
);

// Search movie by movie name.
const rateMovie = async (rl: readline.Interface, userId: number, movieId: number) => {
  const currentRating = (await RatingsModel.findOne({ user_id: userId, movie_id: movieId }))?.rating;
  if (currentRating) {
    console.log('Your current rating is: ', currentRating.toString());
  }
  while (true) {
    let rate = (await questionRate(rl)) as string;
    if (rate === 'exit') {
      return;
    }
    if (!rate || (rate !== '1' && rate !== '2' && rate !== '3' && rate !== '4' && rate !== '5')) {
      console.log('Invalid rate');
      continue;
    }
    let yesOrNo = await questionYesOrNo(rl, +rate);
    if (yesOrNo !== 'yes') {
      if (yesOrNo === 'no') {
        console.log('Rating canceled');
      } else {
        console.log('Invalid input');
      }
      continue;
    }
    try {
      await knex.transaction(async (trx) => {
        const result = await knex.raw(`SELECT * FROM ratings WHERE user_id = ${userId} AND movie_id = ${movieId} FOR UPDATE;`)
          .transacting(trx);
        if (result.rows.length === 0) {
          await knex.raw(`INSERT INTO 
                  ratings (user_id, movie_id, rating) 
                  VALUES (${userId}, ${movieId}, ${rate})
          ;`).transacting(trx);
        } else {
          await knex.raw(`UPDATE ratings SET rating = ${rate} WHERE user_id = ${userId} AND movie_id = ${movieId};`)
            .transacting(trx);
        }
      });
      console.log('Movie rated!');
      const newMovieRating =  await knex.raw(`SELECT * FROM view_movie_ratings WHERE id = ${movieId};`);
      console.log('New movie average rating: ', newMovieRating.rows[0].avg_rating);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export default rateMovie;

