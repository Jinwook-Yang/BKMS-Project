import { BaseModel, BaseEntity } from './baseModel';

export interface MoviesEntity extends BaseEntity {
  title: string;
  year: string;
  movie_embedding: number[];
}

export const MoviesModel = new BaseModel<MoviesEntity>('movies', (table) => {
  table.string('title').notNullable();
  table.string('year').notNullable();
  table.specificType('movie_embedding', 'VECTOR(100)');
});
