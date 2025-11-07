import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { BaseRepository } from "../common/database/base.repository";

export const baseOrmConfig: Options = {
  driver: PostgreSqlDriver,

  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  extensions: [Migrator],

  migrations: {
    path: "dist/database/migrations",
    pathTs: "src/database/migrations",
    fileName: (timestamp: string, name: string) => `${timestamp}-${name}`,
  },

  entityRepository: BaseRepository,
};
