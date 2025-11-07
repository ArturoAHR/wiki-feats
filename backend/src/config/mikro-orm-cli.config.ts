import { Options } from "@mikro-orm/postgresql";
import "dotenv/config";
import { baseOrmConfig } from "./base-orm.config";

export const MikroOrmCliConfig: Options = {
  ...baseOrmConfig,

  host: process.env.MIKRO_ORM_CLI_HOST,
  port: +process.env.DATABASE_PORT,

  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

export default MikroOrmCliConfig;
