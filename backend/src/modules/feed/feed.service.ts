import { Injectable } from "@nestjs/common";
import { startOfToday } from "date-fns";
import { getIsoDate } from "../../common/helpers/iso-date.utils";
import { ArticleService } from "../article/article.service";
import { ArticleCollectionStatus } from "../article/enum/article-collection-status.enum";
import { GetFeedArticleOptions } from "./types/get-feed-articles-options.types";

@Injectable()
export class FeedService {
  constructor(private readonly articleService: ArticleService) {}

  async getFeedArticles({
    date,
    page,
    pageSize,
    languageCode,
  }: GetFeedArticleOptions) {
    const options = {
      date: date ?? getIsoDate(startOfToday()),
      page: page ?? 1,
      pageSize: pageSize ?? 5,
      languageCode: languageCode ?? "en",
    };

    const articleCollectionStatus =
      await this.articleService.getArticleCollectionStatus(options);

    if (articleCollectionStatus === ArticleCollectionStatus.HasAllArticles) {
      return await this.articleService.getArticlesByDate(options);
    }

    if (
      [
        ArticleCollectionStatus.ImportingRequired,
        ArticleCollectionStatus.ImportingAndTranslationRequired,
      ].includes(articleCollectionStatus)
    ) {
      await this.articleService.importArticles(options);
    }

    if (
      [
        ArticleCollectionStatus.TranslationRequired,
        ArticleCollectionStatus.ImportingAndTranslationRequired,
      ].includes(articleCollectionStatus)
    ) {
      // this.articleService.translateArticles(options);
    }
    return await this.articleService.getArticlesByDate(options);
  }
}
