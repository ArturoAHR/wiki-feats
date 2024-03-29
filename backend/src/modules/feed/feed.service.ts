import { Injectable } from "@nestjs/common";
import { startOfToday } from "date-fns";
import { getIsoDate } from "../../common/helpers/iso-date.utils";
import { ArticleService } from "../article/article.service";
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

    const areArticlesImported =
      await this.articleService.checkIfArticlesAreImported(options);
    const areArticlesTranslated =
      await this.articleService.checkIfArticlesAreTranslated(options);

    if (!areArticlesImported) {
      await this.articleService.importArticles(options);
    }

    if (!areArticlesTranslated) {
      await this.articleService.translateArticles(options);
    }

    if (languageCode !== "en") {
      return await this.articleService.getTranslatedArticlesByDate(options);
    }

    return await this.articleService.getImportedArticlesByDate(options);
  }
}
