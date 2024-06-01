import { MoviesModel } from 'models/movies';
import { question } from 'modules/utils';
import knex from 'postgres/connection';
import * as readline from 'readline';
import rateMovie from './rateMovie';
import recommendMovie from './recommendMovie';

const questionSearch = async (rl: readline.Interface) => await question(
  rl, `Enter movie name to search. Enter at least 2 characters (Enter exit to stop): `,
);

const questionMovie = async (rl: readline.Interface) => await question(
  rl, `Enter number of the movie that you want to see the information: `,
);

const questionExit = async (rl: readline.Interface) => await question(
  rl, `Enter action for the movie: search / recommend / rate / back: `,
);

// Search movie by movie name.
const searchMovie = async (rl: readline.Interface, userId: number) => {
  while (true) {
    let searchParam = await questionSearch(rl);
    if (searchParam === 'exit') {
      return;
    }
    if (!searchParam || (searchParam as string).length < 2) {
      console.log('Enter at least 3 characters');
      continue;
    }
    try {
      // ilike: case insensitive like
      const result = await MoviesModel.table().where('title', 'ilike', `%${searchParam}%`);
      if (result.length === 0) {
        console.log('Movie not found!');
        continue;
      }
      console.log('Movie found!');
      // select movie by number;
      for (let i = 0; i < result.length; i++) {
        console.log(`${i + 1}. ${result[i].title} (${result[i].year})`);
      }
      const selectedMovie = await questionMovie(rl);
      if (selectedMovie === 'exit') {
        return;
      }
      for (let i = 0; i < result.length; i++) {
        if (i + 1 === Number(selectedMovie)) {
          const movieId = result[i].id;
          const avgRating = await knex.raw(`SELECT * FROM view_movie_ratings WHERE id = ${movieId};`);
          console.log(`${result[i].title} (${result[i].year})`);
          console.log(`Average Rating: ${avgRating.rows[0].avg_rating}`);
          const genres = await knex.raw(`
            SELECT genre_name FROM movie_genre 
            JOIN genres ON movie_genre.genre_id = genres.id 
            WHERE movie_id = ${movieId};`);
          console.log('Genres: ', genres.rows.map((genre: any) => genre.genre_name).join(', '));
          break;
        }
        if (i === result.length - 1) {
          console.log('Invalid movie number');
          return;
        }
      }
      const nextAction = await questionExit(rl);
      switch (nextAction) {
        case 'search':
          break;
        case 'recommend':
          await recommendMovie(rl, userId, Number(selectedMovie));
          break;
        case 'rate':
          await rateMovie(rl, userId, Number(selectedMovie));
          break;
        case 'back':
          return;
        default:
          console.log('Invalid command');
          return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export default searchMovie;
