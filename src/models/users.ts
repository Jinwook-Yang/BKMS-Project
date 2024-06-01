import { BaseModel, BaseEntity } from './baseModel';

export interface UserEntity extends BaseEntity {
  user_email: string; // Did not use userId because Id means index id at DB.
  user_name: string;
  password: string;
}

export const UsersModel = new BaseModel<UserEntity>('users', (table) => {
  table.string('user_email').notNullable().unique();
  table.string('user_name').notNullable();
  table.string('password').notNullable();
});
