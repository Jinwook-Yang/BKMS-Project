import { BaseModel, BaseEntity } from './baseModel';
import knex from 'postgres/connection';

export interface RatingsEntity extends BaseEntity {
  user_id: number,
  movie_id: number,
  rating: number,
  timestamp: Date,
}

export const RatingsModel = new BaseModel<RatingsEntity>('ratings', (table) => {
  table.integer('user_id').references('id').inTable('users').notNullable();
  table.integer('movie_id').references('id').inTable('movies').notNullable();
  table.integer('rating').notNullable();
  table.unique(['user_id', 'movie_id']);
  table.timestamp('timestamp').defaultTo(knex.fn.now());
});
