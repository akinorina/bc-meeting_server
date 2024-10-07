import { DataSource } from 'typeorm';
import configuration from '../config/configuration';

export const dataSource = new DataSource({
  type: 'mysql',
  host: configuration().database.host,
  port: configuration().database.port,
  username: configuration().database.user,
  password: configuration().database.password,
  database: configuration().database.dbname,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
