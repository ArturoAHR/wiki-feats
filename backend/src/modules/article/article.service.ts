import { QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { PaginatedFindResult } from "../../common/@types/types/pagination.types";
import { BaseRepository } from "../../common/database/base.repository";
import { Article } from "../../database/entities/article.entity";
import { WikipediaService } from "../wikipedia/wikipedia.service";
import { GetArticlesByDateOptions } from "./types/get-articles-by-date-options.types";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: BaseRepository<Article>,
    private readonly wikipediaService: WikipediaService,
  ) {}

  async importArticles(date: string) {
    const articles = await this.wikipediaService.fetchFeaturedContents(date);

    articles.map((article) => {
      return this.articleRepository.create({
        title: article.titles.normalized,
        extract: article.extract,
        articleUrl: article.content_urls.desktop.page,
        articleType: article.articleType,
        wikipediaPageId: article.pageid,
        featuredDate: new Date(date),
        ...(article.thumbnail?.source && {
          thumbnail: {
            url: article.thumbnail.source,
            width: article.thumbnail.width,
            height: article.thumbnail.height,
          },
        }),
      });
    });

    await this.articleRepository.getEntityManager().flush();
  }

  async getArticlesByDate(
    date: string,
    options?: GetArticlesByDateOptions,
  ): Promise<PaginatedFindResult<Article>> {
    return await this.articleRepository.findPaginated(
      { page: options?.page ?? 1, pageSize: options?.pageSize ?? 5 },
      { featuredDate: new Date(date) },
      {
        orderBy: {
          articleType: QueryOrder.ASC,
        },
      },
    );
  }
}
