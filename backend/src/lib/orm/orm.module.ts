import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";
import mikroOrmConfig from "../../config/mikro-orm.config";
import { OrmService } from "./orm.service";

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: () => {
        return mikroOrmConfig();
      },
    }),
  ],
  providers: [OrmService],
  exports: [MikroOrmModule],
})
export class OrmModule {}
