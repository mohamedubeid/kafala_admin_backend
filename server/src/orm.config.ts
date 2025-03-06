import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const commonConf = {
  SYNCRONIZE: false,
  ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
  MIGRATIONS: [__dirname + '/migrations/*{.ts,.js}', __dirname + '/migrations/seeds/*{.ts,.js}'],
  CLI: {
    migrationsDir: 'src/migrations',
  },
  MIGRATIONS_RUN: false,
};

const ormConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'mysql',
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: false,
  synchronize: false,
  entities: commonConf.ENTITIES,
  migrations: commonConf.MIGRATIONS,
  cli: commonConf.CLI,
  migrationsRun: commonConf.MIGRATIONS_RUN,
};

export = ormConfig;
