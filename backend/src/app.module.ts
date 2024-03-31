import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { mikroOrmConfig } from "./config/mikro-orm.config";
import { swaggerConfig } from "./config/swagger.config";
import { OrmModule } from "./lib/orm/orm.module";
import { FeedModule } from "./modules/feed/feed.module";
import { TranslateModule } from "./modules/translate/translate.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mikroOrmConfig, swaggerConfig],
    }),
    ScheduleModule.forRoot(),
    OrmModule,
    FeedModule,
    TranslateModule,
  ],
})
export class AppModule {}
