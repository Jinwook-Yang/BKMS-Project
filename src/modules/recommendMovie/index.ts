import { question } from 'modules/utils';
import * as readline from 'readline';

const questionSearch = async (rl: readline.Interface) => await question(
  rl, `Enter movie name that you have watched (Enter exit to stop): `,
);

// Search movie by movie name and recommend movie's name.
const searchMovie = async (rl: readline.Interface, userId: number) => {
  let searchParam = await questionSearch(rl);
  if (searchParam === 'exit') {
    return;
  }
  try {
    // await MovieModel.knex.where('movieName', 'like', `%${searchParam}%`);
    // TODO: vector db
    // console.log(`5 most similar movies with ${}`);
    // console.log(result);
  } catch (error) {
    console.log(error);
    return;
  }
}

export default searchMovie;
