import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "./config/mikro-orm.config";
import { FeedModule } from "./modules/feed/feed.module";

@Module({
  imports: [ConfigModule.forRoot(), MikroOrmModule.forRoot(config), FeedModule],
})
export class AppModule {}
