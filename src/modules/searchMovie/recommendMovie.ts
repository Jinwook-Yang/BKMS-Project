import { MoviesModel } from 'models/movies';
import { question } from 'modules/utils';
import knex from 'postgres/connection';
import * as readline from 'readline';

const questionRecommend = async (rl: readline.Interface) => await question(
  rl, `Do you want to get recommendation based on genre? (yes / no): `,
);

const questionGenre = async (rl: readline.Interface) => await question(
  rl, `Enter genre number: `,
);

// Search movie by movie name.
const recommendMovie = async (rl: readline.Interface, userId: number, movieId: number) => {
  while (true) {
    let yesOrNo = (await questionRecommend(rl)) as string;
    if (yesOrNo !== 'no' && yesOrNo !== 'yes') {
      console.log('Invalid answer');
      continue;
    }
    
    const currentMovieEmbedding = (await MoviesModel.findOne({
      id: movieId,
    }))?.movie_embedding;
    if (yesOrNo === 'no') {
      const result = await knex.raw(`
        SELECT id, title, movie_embedding, 
        (movie_embedding <-> '${currentMovieEmbedding}') AS similarity
        FROM movies
        ORDER BY similarity
        LIMIT 5;
      `);
      console.log('Recommendation based on movie embedding: ');
      // Exclude the first row because it is the same movie.
      for (let i = 1; i < result.rows.length; i++) {
        console.log(`${i}. ${result.rows[i].title}`);
      }
    } else if (yesOrNo === 'yes') {
      const genres = await knex.raw(`
        SELECT genre_id, genre_name FROM movie_genre
        JOIN genres ON movie_genre.genre_id = genres.id
        WHERE movie_id = ${movieId};
      `);
      console.log('Current movie genres: ');
      for (let i = 0; i < genres.rows.length; i++) {
        console.log(`${i + 1}. ${genres.rows[i].genre_name}`);
      }
      const genreNumber = await questionGenre(rl);
      const genreId = genres.rows[Number(genreNumber) - 1].genre_id;
      const result = await knex.raw(`
        SELECT movies.id, title, movie_embedding, 
        (movie_embedding <-> '${currentMovieEmbedding}') AS similarity
        FROM movies
        JOIN movie_genre ON movies.id = movie_genre.movie_id
        WHERE genre_id = ${genreId}
        ORDER BY similarity
        LIMIT 5;
      `);
      console.log('Recommendation based on genre and movie embedding: ');
      // Exclude the first row because it is the same movie.
      for (let i = 1; i < result.rows.length; i++) {
        console.log(`${i}. ${result.rows[i].title}`);
      }
    }
  }
}

export default recommendMovie;


