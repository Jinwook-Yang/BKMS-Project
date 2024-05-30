import { BaseModel, BaseEntity } from './baseModel';

export interface SettingsEntity extends BaseEntity {
  userId: number,
  isAdmin: boolean
}

export const SettingsModel = new BaseModel<SettingsEntity>('users', (table) => {
  table.string('userId').references('id').inTable('users').notNullable().unique();
  table.boolean('isAdmin').notNullable();
});
