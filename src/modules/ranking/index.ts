import knex from 'postgres/connection';

const getMovieRanking = async () => {
  const result = await knex.raw(`
    SELECT * FROM view_movie_ratings
    ORDER BY avg_rating DESC LIMIT 10;
  `);
  console.log('### Top 10 Movies ###');
  for (let i = 0; i < result.rows.length; i++) {
    console.log(`${i + 1}. ${result.rows[i].title} (${result.rows[i].avg_rating})`);
  }
  console.log('### End ###');
}

export default getMovieRanking;
