import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import "dotenv/config";

export const config: Options = {
  driver: PostgreSqlDriver,

  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,

  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,

  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
};
