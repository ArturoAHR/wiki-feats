import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ArticleCollection } from "../../database/entities/article-collection.entity";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import { TranslateModule } from "../translate/translate.module";
import { WikipediaModule } from "../wikipedia/wikipedia.module";
import { ArticleService } from "./article.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([Article, ArticleCollection, Language]),
    WikipediaModule,
    TranslateModule,
  ],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
