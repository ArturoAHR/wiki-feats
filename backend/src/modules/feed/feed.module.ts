import { Module } from "@nestjs/common";
import { ArticleModule } from "../article/article.module";
import { TranslateModule } from "../translate/translate.module";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

@Module({
  imports: [ArticleModule, TranslateModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
