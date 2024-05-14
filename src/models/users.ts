import { BaseModel, BaseEntity } from './baseModel';

export interface UserEntity extends BaseEntity {
  userId: string;
  password: string;
}

export const userModel = new BaseModel<UserEntity>('users');
