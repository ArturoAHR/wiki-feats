import { Migrator } from "@mikro-orm/migrations";
import { defineConfig, Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { BaseRepository } from "../common/database/base.repository";

export const mikroOrmConfig: () => Options = () =>
  defineConfig({
    driver: PostgreSqlDriver,

    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,

    dbName: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,

    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],

    extensions: [Migrator],

    migrations: {
      path: "dist/database/migrations",
      pathTs: "src/database/migrations",
      fileName: (timestamp: string, name: string) => `${timestamp}-${name}`,
    },

    entityRepository: BaseRepository,
  });

export default mikroOrmConfig;
