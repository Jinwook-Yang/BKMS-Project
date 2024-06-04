import knex from 'postgres/connection';

// Get top 10 movies based on average rating.
const getMovieRanking = async () => {
  const result = await knex.raw(`
    SELECT row_number() OVER (ORDER BY avg_rating DESC) AS rank, title, avg_rating
    FROM view_movie_ratings
    LIMIT 10;
  `);
  console.log('### Top 10 Movies ###');
  for (let i = 0; i < result.rows.length; i++) {
    console.log(`${result.rows[i].rank}. ${result.rows[i].title} (${result.rows[i].avg_rating})`);
  }
  console.log('### End ###');
}

export default getMovieRanking;
