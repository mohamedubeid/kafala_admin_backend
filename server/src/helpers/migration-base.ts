import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

export const baseColumns: TableColumnOptions[] = [
  {
    name: 'id',
    type: 'int4',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'createdBy',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'createdDate',
    type: 'timestamp',
    isNullable: true,
    default: 'now()',
  },
  {
    name: 'lastModifiedBy',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'lastModifiedDate',
    type: 'timestamp',
    isNullable: true,
  },
];
