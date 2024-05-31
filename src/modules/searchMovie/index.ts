import { question } from 'modules/utils';
import * as readline from 'readline';

const questionSearch = async (rl: readline.Interface) => await question(
  rl, `Enter movie name to search (Enter exit to stop): `,
);

const questionMovie = async (rl: readline.Interface) => await question(
  rl, `Enter number of the movie that you want to see the information: `,
);

const questionExit = async (rl: readline.Interface) => await question(
  rl, `Enter search / recommend / exit / back: `,
);

// Search movie by movie name.
const searchMovie = async (rl: readline.Interface, userId: number) => {
  let searchParam = await questionSearch(rl);
  if (searchParam === 'exit') {
    return;
  }
  try {
    // await MovieModel.knex.where('movieName', 'like', `%${searchParam}%`);
    // console.log('Movie found!');
    // select movie by number;
    // console.log(result);
    // await questionMovie(rl);
    // console.log(movie info);
    // await questionExit(rl);

  } catch (error) {
    console.log(error);
    return;
  }
}

export default searchMovie;
