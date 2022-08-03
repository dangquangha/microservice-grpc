module.exports = {
  type: 'postgres',
  host: process.env['POSTGRES_HOST'] || 'localhost',
  port: parseInt(process.env['POSTGRES_PORT'] || '5432'),
  username: process.env['POSTGRES_USER'] || 'ad-m11',
  password: process.env['POSTGRES_PASSWORD'] || '123456',
  database: process.env['POSTGRES_DB'] || 'userservice',
  synchronize: true,
  migrationsRun: false,
  logging: 'false',
  entities: [__dirname + '/dist/modules/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/dist/migrations/**/*.js'],
  migrationsTableName: 'base_migrations',
  ssl:
    process.env['ENVIRONMENT'] != 'local'
      ? {
        rejectUnauthorized: false,
      }
      : false,
  cli: {
    entitiesDir: 'src/modules/entities/*.entity{.ts,.js}',
    migrationsDir: 'src/migrations',
  },
};
