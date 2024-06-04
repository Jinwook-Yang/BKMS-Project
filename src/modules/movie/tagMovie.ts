import { TagsModel } from 'models/tags';
import { question } from 'modules/utils';
import knex from 'postgres/connection';
import * as readline from 'readline';

const questionTag = async (rl: readline.Interface) => await question(
  rl, `Enter tag for the movie (exit): `,
);

const questionYesOrNo = async (rl: readline.Interface, tag: string) => await question(
  rl, `Do you really want to tag this movie as '${tag}' (yes / no): `,
);

// Search movie by movie name.
const tagMovie = async (rl: readline.Interface, userId: number, movieId: number) => {
  const currentTag = (await TagsModel.findOne({ user_id: userId, movie_id: movieId }))?.tag;
  if (currentTag) {
    console.log('Your current tag is: ', currentTag.toString());
  }
  while (true) {
    let tag = (await questionTag(rl)) as string;
    if (tag === 'exit') {
      return;
    }
    if (!tag) {
      console.log('Invalid rate');
      continue;
    }
    let yesOrNo = await questionYesOrNo(rl, tag);
    if (yesOrNo !== 'yes') {
      if (yesOrNo === 'no') {
        console.log('Tag canceled');
      } else {
        console.log('Invalid input');
      }
      continue;
    }
    try {
      await knex.transaction(async (trx) => {
        const result = await knex.raw(`SELECT * FROM tags WHERE user_id = ${userId} AND movie_id = ${movieId} FOR UPDATE;`)
          .transacting(trx);
        if (result.rows.length === 0) {
          await knex.raw(`INSERT INTO 
                  tags (user_id, movie_id, tag) 
                  VALUES (${userId}, ${movieId}, '${tag}')
          ;`).transacting(trx);
        } else {
          await knex.raw(`UPDATE tags SET tag = '${tag}' WHERE user_id = ${userId} AND movie_id = ${movieId};`)
            .transacting(trx);
        }
      });
      console.log('Movie tagged!');
      const tags = await knex.raw(`
              SELECT tag FROM tags
              WHERE movie_id = ${movieId};`);
            // Use Set to remove duplicate tags
      const tagsList = new Set(tags.rows.map((tag: any) => tag.tag));
      console.log('New tags: ', [...tagsList].join(', '));
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export default tagMovie;

