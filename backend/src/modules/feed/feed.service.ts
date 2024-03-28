import { Injectable } from "@nestjs/common";
import { Pagination } from "../../common/@types/types/pagination.types";
import { ArticleService } from "../article/article.service";

@Injectable()
export class FeedService {
  constructor(private readonly articleService: ArticleService) {}

  async getFeedArticles(date: string, options?: Partial<Pagination>) {
    if (await this.articleService.areDateArticlesImported(date)) {
      return await this.articleService.getArticlesByDate(date, options);
    }

    await this.articleService.importArticles(date);
    return await this.articleService.getArticlesByDate(date, options);
  }
}
