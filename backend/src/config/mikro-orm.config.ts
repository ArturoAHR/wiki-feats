import { defineConfig } from "@mikro-orm/core";
import { Options } from "@mikro-orm/postgresql";
import { baseOrmConfig } from "./base-orm.config";

export const mikroOrmConfig: () => Options = () =>
  defineConfig({
    ...baseOrmConfig,

    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,

    dbName: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

export default mikroOrmConfig();
