import knex from 'postgres/connection';

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export class BaseModel<T extends BaseEntity> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findAll(): Promise<T[]> {
    return knex(this.tableName).select();
  }

  async findById(id: number): Promise<T> {
    return knex(this.tableName).where({ id }).first();
  }

  async create(data: any): Promise<T[]> {
    return knex(this.tableName).insert(data).returning('*');
  }

  async update(id: number, data: any): Promise<T[]> {
    return knex(this.tableName).where({ id }).update(data).returning('*');
  }

  async delete(id: number) {
    return knex(this.tableName).where({ id }).del();
  }
}
