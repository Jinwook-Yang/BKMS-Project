import { BaseModel, BaseEntity } from './baseModel';

export interface UserEntity extends BaseEntity {
  userEmail: string; // Did not use userId because Id means index id at DB.
  userName: string;
  password: string;
}

export const UsersModel = new BaseModel<UserEntity>('users', (table) => {
  table.string('userEmail').notNullable().unique();
  table.string('userName').notNullable();
  table.string('password').notNullable();
});
