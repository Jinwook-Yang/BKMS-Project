import { BaseModel, BaseEntity } from './baseModel';
import knex from 'postgres/connection';

export interface TagsEntity extends BaseEntity {
  user_id: number,
  movie_id: number,
  tag: string,
  timestamp: Date,
}

export const TagsModel = new BaseModel<TagsEntity>('tags', (table) => {
  table.integer('user_id').references('id').inTable('users').notNullable();
  table.integer('movie_id').references('id').inTable('movies').notNullable();
  table.string('tag').notNullable();
  table.timestamp('timestamp').defaultTo(knex.fn.now());
});
