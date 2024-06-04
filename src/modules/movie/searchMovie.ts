import { MoviesModel } from 'models/movies';
import { question } from 'modules/utils';
import knex from 'postgres/connection';
import * as readline from 'readline';

const questionSearch = async (rl: readline.Interface) => await question(
  rl, `Enter movie name to search. Enter at least 2 characters (Enter exit to stop): `,
);

const questionMovie = async (rl: readline.Interface) => await question(
  rl, `Enter number of the movie that you want to see the information: `,
);

// Search movie by movie name.
const searchMovie = async (rl: readline.Interface, userId: number) => {
  while (true) {
    let searchParam = await questionSearch(rl);
    if (searchParam === 'exit') {
      return -1;
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
      while (true) {
        const selectedMovie = await questionMovie(rl);
        if (selectedMovie === 'exit') {
          return -1;
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
            const tags = await knex.raw(`
              SELECT tag FROM tags
              WHERE movie_id = ${movieId};`);
            // Use Set to remove duplicate tags
            const tagsList = new Set(tags.rows.map((tag: any) => tag.tag));
            console.log('Tags: ', [...tagsList].join(', '));
            return movieId;
          }
        }
        console.log('Invalid movie number');
      }
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
}

export default searchMovie;
