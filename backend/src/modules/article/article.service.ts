import { QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PaginatedFindResult } from "../../common/@types/types/pagination.types";
import { BaseRepository } from "../../common/database/base.repository";
import { ArticleCollection } from "../../database/entities/article-collection.entity";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import { TranslateService } from "../translate/translate.service";
import { WikipediaService } from "../wikipedia/wikipedia.service";
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

    private readonly entityManager: EntityManager,
    private readonly wikipediaService: WikipediaService,
    private readonly translateService: TranslateService,
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

    await this.entityManager.flush();
  }

  async translateArticles({
    date,
    languageCode,
    page,
    pageSize,
  }: GetArticleOptions) {
    const englishArticleCollection =
      await this.articleCollectionRepository.findOne({
        language: { code: "en" },
        featuredDate: new Date(date),
      });

    let articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: languageCode },
      featuredDate: new Date(date),
    });

    if (!articleCollection) {
      const language = await this.languageRepository.findOneOrFail({
        code: languageCode,
      });

      articleCollection = await this.articleCollectionRepository.create({
        featuredDate: new Date(date),
        language,
        availableArticles: 0,
        totalArticles: englishArticleCollection.totalArticles,
      });
    }

    const paginatedEnglishArticles = await this.getImportedArticlesByDate({
      date,
      languageCode: "en",
      page,
      pageSize,
    });

    const englishArticlesWikipediaPageIds = paginatedEnglishArticles.items.map(
      (article) => article.wikipediaPageId,
    );

    const alreadyTranslatedArticles = await this.articleRepository.find({
      articleCollection,
      wikipediaPageId: { $in: englishArticlesWikipediaPageIds },
    });

    const untranslatedArticles = paginatedEnglishArticles.items.filter(
      (article) =>
        !alreadyTranslatedArticles.some(
          (translatedArticle) =>
            translatedArticle.wikipediaPageId === article.wikipediaPageId,
        ),
    );

    const translatedArticles = await this.translateService.translateArticles({
      articles: untranslatedArticles,
      targetLanguageCode: languageCode,
    });

    translatedArticles.forEach((translatedArticle) => {
      return this.articleRepository.create({
        ...translatedArticle,
        articleCollection,
      });
    });

    articleCollection.availableArticles += translatedArticles.length;

    await this.entityManager.flush();
  }

  async getTranslatedArticlesByDate({ date, languageCode, page, pageSize }) {
    const articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: languageCode },
      featuredDate: new Date(date),
    });

    const paginatedEnglishArticles = await this.getImportedArticlesByDate({
      date,
      languageCode: "en",
      page,
      pageSize,
    });

    const englishArticlesWikipediaPageIds = paginatedEnglishArticles.items.map(
      (article) => article.wikipediaPageId,
    );

    // We fork here to avoid returning article collections with its articles
    const forkedEntityManager = this.entityManager.fork();
    const forkedArticleRepository = forkedEntityManager.getRepository(Article);

    const articles = await forkedArticleRepository.find(
      {
        articleCollection,
        wikipediaPageId: { $in: englishArticlesWikipediaPageIds },
      },
      {
        orderBy: {
          articleType: QueryOrder.ASC,
          wikipediaPageId: QueryOrder.ASC,
        },
        populate: ["thumbnail"],
      },
    );

    return { items: [...articles], meta: paginatedEnglishArticles.meta };
  }

  async getImportedArticlesByDate({
    date,
    page,
    pageSize,
  }: GetArticleOptions): Promise<PaginatedFindResult<Article>> {
    const articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: "en" },
      featuredDate: new Date(date),
    });

    const articles = await this.articleRepository.findPaginated(
      { page, pageSize },
      { articleCollection },
      {
        orderBy: {
          articleType: QueryOrder.ASC,
          wikipediaPageId: QueryOrder.ASC,
        },
      },
    );

    return articles;
  }

  async checkIfArticlesAreImported({
    date,
  }: GetArticleOptions): Promise<boolean> {
    const articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: "en" },
      featuredDate: new Date(date),
    });

    return Boolean(articleCollection);
  }

  async checkIfArticlesAreTranslated({
    date,
    languageCode,
    page,
    pageSize,
  }: GetArticleOptions): Promise<boolean> {
    if (languageCode === "en") return true;

    const articleCollection = await this.articleCollectionRepository.findOne({
      language: { code: languageCode },
      featuredDate: new Date(date),
    });

    if (!articleCollection) return false;

    const englishArticleCollection =
      await this.articleCollectionRepository.findOne({
        language: { code: "en" },
        featuredDate: new Date(date),
      });

    if (!englishArticleCollection) return false;

    const paginatedEnglishArticles = await this.getImportedArticlesByDate({
      date,
      languageCode: "en",
      page,
      pageSize,
    });

    const englishArticlesWikipediaPageIds = paginatedEnglishArticles.items.map(
      (article) => article.wikipediaPageId,
    );

    const alreadyTranslatedArticles = await this.articleRepository.find({
      articleCollection,
      wikipediaPageId: { $in: englishArticlesWikipediaPageIds },
    });

    return (
      alreadyTranslatedArticles.length === paginatedEnglishArticles.items.length
    );
  }
}
