import { QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { PaginatedFindResult } from "../../common/@types/types/pagination.types";
import { BaseRepository } from "../../common/database/base.repository";
import { ArticleCollection } from "../../database/entities/article-collection.entity";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import { WikipediaService } from "../wikipedia/wikipedia.service";
import { GetArticlesByDateOptions } from "./types/get-articles-by-date-options.types";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: BaseRepository<Article>,
    @InjectRepository(ArticleCollection)
    private readonly articleCollectionRepository: BaseRepository<ArticleCollection>,
    @InjectRepository(Language)
    private readonly languageRepository: BaseRepository<Language>,

    private readonly wikipediaService: WikipediaService,
  ) {}

  async importArticles(date: string) {
    const articles = await this.wikipediaService.fetchFeaturedContents(date);

    const englishLanguage = await this.languageRepository.findOneOrFail({
      code: "en",
    });

    const articleCollection = this.articleCollectionRepository.create({
      featuredDate: new Date(date),
      availableArticles: articles.length,
      totalArticles: articles.length,
      language: englishLanguage,
    });

    articles.forEach((article) => {
      return this.articleRepository.create({
        title: article.titles.normalized,
        extract: article.extract,
        extractHtml: article.extract_html,
        context: article.story ?? article.text,
        articleUrl: article.content_urls.desktop.page,
        articleType: article.articleType,
        wikipediaPageId: article.pageid,
        articleCollection,
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
    const articleCollection = await this.articleCollectionRepository.findOne({
      featuredDate: new Date(date),
      deletedAt: { $exists: false },
    });

    const articles = await this.articleRepository.findPaginated(
      { page: options?.page ?? 1, pageSize: options?.pageSize ?? 5 },
      { articleCollection, deletedAt: { $exists: false } },
      { orderBy: { articleType: QueryOrder.ASC } },
    );

    return articles;
  }

  async areDateArticlesImported(date: string) {
    const articleCollection = await this.articleCollectionRepository.findOne({
      featuredDate: new Date(date),
      deletedAt: { $exists: false },
    });

    return Boolean(
      articleCollection && articleCollection.availableArticles !== 0,
    );
  }
}
