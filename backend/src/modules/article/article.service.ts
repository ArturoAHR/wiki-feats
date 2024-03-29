import { QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { PaginatedFindResult } from "../../common/@types/types/pagination.types";
import { BaseRepository } from "../../common/database/base.repository";
import { ArticleCollection } from "../../database/entities/article-collection.entity";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import { WikipediaService } from "../wikipedia/wikipedia.service";
import { ArticleCollectionStatus } from "./enum/article-collection-status.enum";
import { GetArticleOptions } from "./types/get-article-options.types";

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

  async importArticles({ date }: GetArticleOptions) {
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

  async getArticlesByDate({
    date,
    languageCode,
    page,
    pageSize,
  }: GetArticleOptions): Promise<PaginatedFindResult<Article>> {
    const articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: languageCode },
      featuredDate: new Date(date),
      deletedAt: { $exists: false },
    });

    const articles = await this.articleRepository.findPaginated(
      { page, pageSize },
      { articleCollection, deletedAt: { $exists: false } },
      {
        orderBy: {
          articleType: QueryOrder.ASC,
          wikipediaPageId: QueryOrder.ASC,
        },
      },
    );

    return articles;
  }

  async getArticleCollectionStatus({
    date,
    page,
    pageSize,
    languageCode,
  }: GetArticleOptions): Promise<ArticleCollectionStatus> {
    const articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: languageCode ?? "en" },
      featuredDate: new Date(date),
      deletedAt: { $exists: false },
    });

    // Non-imported article collections don't exist in the database and collections that require
    // translation have partial article collection availability.
    const doesArticleCollectionExist = Boolean(articleCollection);
    const isLanguageCodeEnglish = languageCode === "en";
    const arePageArticlesUnavailable =
      articleCollection?.availableArticles - (page - 1) * pageSize < 0;

    if (!doesArticleCollectionExist && isLanguageCodeEnglish) {
      return ArticleCollectionStatus.ImportingRequired;
    }

    if (!doesArticleCollectionExist) {
      return ArticleCollectionStatus.ImportingAndTranslationRequired;
    }

    if (arePageArticlesUnavailable) {
      return ArticleCollectionStatus.TranslationRequired;
    }

    return ArticleCollectionStatus.HasAllArticles;
  }
}
