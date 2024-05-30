import { ColumnBuilder, TableBuilder } from 'knex';
import knex from 'postgres/connection';

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TableBuilderExtended extends TableBuilder {
  // eslint-disable-next-line no-use-before-define
  refersTo: (model: BaseModel) => ColumnBuilder,
}

const getReferenceColumnName = (model: BaseModel) => `${model.tableName}Id`;

// Base model helper class to use knex easily.
// Add builder and query functions to the model.
export class BaseModel<T extends BaseEntity=any> {
  public tableName: string;
  public knex: typeof knex = knex;
  private builder: (table: TableBuilder) => void;

  constructor(tableName: string, builder: (table: TableBuilderExtended) => void) {
    this.tableName = tableName;
    this.builder = (table: TableBuilder) => {
      table.increments();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      const tableExtended = (table as TableBuilderExtended);
      tableExtended.refersTo = (model) => table
        .integer(getReferenceColumnName(model))
        .references('id')
        .inTable(model.tableName);
      builder(tableExtended);
    };
  }

  createTableIfNotExists = () => knex.schema.hasTable(this.tableName)
    .then((result) => {
      if (!result) {
        return knex.schema.createTable(this.tableName, this.builder).then(() => true);
      }
      return Promise.resolve(false);
    });

  async findAll(): Promise<T[]> {
    return knex(this.tableName).select();
  }

  async findById(id: number): Promise<T> {
    return knex(this.tableName).where({ id }).first();
  }

  async findOne(data: any): Promise<T> {
    return knex(this.tableName).where(data).first();
  }

  async create(data: any): Promise<T[]> {
    return knex(this.tableName).insert(data).returning('*');
  }

  async update(id: number, data: any): Promise<T[]> {
    return knex(this.tableName).where({ id }).update(data).returning('*');
  }

  async deleteById(id: number) {
    return knex(this.tableName).where({ id }).del();
  }

  async deleteByData(data: any) {
    return knex(this.tableName).where(data).del();
  }
}
