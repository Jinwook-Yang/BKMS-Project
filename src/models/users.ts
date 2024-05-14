import { BaseModel, BaseEntity } from './baseModel';

export interface UserEntity extends BaseEntity {
  userId: string;
  password: string;
}

export const UsersModel = new BaseModel<UserEntity>('users', (table) => {
  table.string('userId').notNullable().unique();
  table.string('password').notNullable();
});
