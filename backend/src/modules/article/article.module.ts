import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Article } from "../../database/entities/article.entity";
import { WikipediaModule } from "../wikipedia/wikipedia.module";
import { ArticleService } from "./article.service";

@Module({
  imports: [MikroOrmModule.forFeature([Article]), WikipediaModule],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
