import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { mikroOrmConfig } from "./config/mikro-orm.config";
import { FeedModule } from "./modules/feed/feed.module";
import { TranslateModule } from "./modules/translate/translate.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    FeedModule,
    TranslateModule,
  ],
})
export class AppModule {}
