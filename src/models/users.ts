import { BaseModel, BaseEntity } from './baseModel';

export interface UserEntity extends BaseEntity {
  userId: string;
  userName: string;
  password: string;
}

export const UsersModel = new BaseModel<UserEntity>('users', (table) => {
  table.string('userId').notNullable().unique();
  table.string('userName').notNullable();
  table.string('password').notNullable();
});
