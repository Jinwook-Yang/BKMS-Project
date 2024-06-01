import { BaseModel, BaseEntity } from './baseModel';

export interface MovieGenresEntity extends BaseEntity {
  movie_id: number,
  genre_id: number,
}

export const MovieGenresModel = new BaseModel<MovieGenresEntity>('ratings', (table) => {
  table.integer('movie_id').references('id').inTable('movies').notNullable();
  table.integer('genre_id').references('id').inTable('genres').notNullable();
});
