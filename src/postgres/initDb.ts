import fs from 'fs';
import csv from 'csv-parser';
import knex from './connection';
import { UsersModel } from 'models/users';
import { MoviesModel } from 'models/movies';
import { GenresModel } from 'models/genres';
import { MovieGenresModel } from 'models/movieGenres';
import { RatingsModel } from 'models/ratings';
import { TagsModel } from 'models/tags';

const addDataToTables = async (tableName: string) => {
  const results = [] as any[];
  
  await new Promise((resolve, reject) => {
    fs.createReadStream(`src/postgres/${tableName}.csv`)
      .pipe(csv())
      .on('data', (data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i][0] === '"') {
            data[i] = JSON.parse(data[i]);
          }
        }
        // console.log(data);
        results.push(data);
      })
      .on('end', () => {
        resolve(true);
      });
  });
  // await knex.raw(`ALTER TABLE ${tableName} DISABLE TRIGGER ALL;`);
  // await knex.raw('SET session_replication_role = replica;');
  for (let i = 0; i < results.length / 1000; i++) {
    if (tableName === 'users') {
      await knex(tableName).insert(results.slice(i * 1000, (i + 1) * 1000)).onConflict('user_email').ignore();
    } else {
      await knex(tableName).insert(results.slice(i * 1000, (i + 1) * 1000));
    }
  }
  // await knex.raw(`ALTER TABLE ${tableName} ENABLE TRIGGER ALL;`);
  // await knex.raw('SET session_replication_role = DEFAULT;');
  await knex.raw(`
    SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), 
                  COALESCE(MAX(id), 1), 
                  MAX(id) IS NOT NULL) 
    FROM ${tableName};
  `)
  console.log(`Data added to ${tableName} table`);
}

export const initDb = async () => {
  try {
    if (!(await knex.schema.hasTable('users'))) {
      console.log('No tables! Creating tables...');
      await UsersModel.createTableIfNotExists();
      await addDataToTables(UsersModel.tableName);

      await knex.raw('CREATE EXTENSION IF NOT EXISTS vector;');
      await MoviesModel.createTableIfNotExists();
      await addDataToTables(MoviesModel.tableName);
      
      await RatingsModel.createTableIfNotExists();
      await addDataToTables(RatingsModel.tableName);

      await GenresModel.createTableIfNotExists();
      await addDataToTables(GenresModel.tableName);

      await MovieGenresModel.createTableIfNotExists();
      await addDataToTables(MovieGenresModel.tableName);


      await TagsModel.createTableIfNotExists();
      await addDataToTables(TagsModel.tableName);

      await knex.raw(`
        CREATE VIEW view_movie_ratings AS (
        SELECT m.id, m.title, ROUND(AVG(r.rating)::numeric, 1) AS avg_rating
        FROM movies m
        JOIN ratings r ON m.id = r.movie_id 
        GROUP BY m.id, m.title
        );
      `);

      await knex.raw(`
        CREATE OR REPLACE FUNCTION delete_user_related_data() 
        RETURNS TRIGGER AS $$
        BEGIN
        -- ratings 테이블에서 사용자 관련 데이터 삭제
        DELETE FROM ratings WHERE user_id = OLD.id;

        -- tags 테이블에서 사용자 관련 데이터 삭제
        DELETE FROM tags WHERE user_id = OLD.id;

        RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;
      `);

      await knex.raw(`
        CREATE TRIGGER user_delete_trigger
        BEFORE DELETE ON users
        FOR EACH ROW
        EXECUTE FUNCTION delete_user_related_data();
      `);

      console.log('Tables created!');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    knex.destroy();
  }
}

export default initDb;
