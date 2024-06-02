import { BaseModel, BaseEntity } from './baseModel';

export interface MovieGenresEntity extends BaseEntity {
  genre_name: string,
}

export const GenresModel = new BaseModel<MovieGenresEntity>('genres', (table) => {
  table.string('genre_name').notNullable();
});
