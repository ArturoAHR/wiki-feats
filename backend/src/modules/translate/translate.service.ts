import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { ArticleType } from "../../common/@types/enum/article-type.enum";
import { BaseRepository } from "../../common/database/base.repository";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import {
  GetAvailableLanguagesResponse,
  GetTranslatedTextRequest,
  GetTranslatedTextResponse,
} from "./types/libre-translate-api-response.types";
import { TranslateArticleOptions } from "./types/translation.types";

@Injectable()
export class TranslateService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Language)
    private readonly languageRepository: BaseRepository<Language>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  async onModuleInit() {
    const englishLanguageCount = await this.languageRepository.count({
      code: "en",
    });

    if (englishLanguageCount === 0) {
      await this.addEnglishLanguage();
    }
  }

  async addEnglishLanguage() {
    const forkedEm = this.entityManager.fork();
    const forkedLanguageRepository = forkedEm.getRepository(Language);

    forkedLanguageRepository.create({
      code: "en",
      name: "English",
    });

    await forkedEm.flush();
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: "language-import" })
  async checkIfTranslationLanguagesAreImported() {
    const languageCount = await this.languageRepository.count();
    if (languageCount > 1) {
      this.schedulerRegistry.deleteCronJob("language-import");
    }

    if (await this.isTranslationApiAvailable())
      await this.importTranslationLanguages();
  }

  async isTranslationApiAvailable(): Promise<boolean> {
    const translateApiUrl = this.configService.get("LIBRE_TRANSLATE_API_URL");

    try {
      await firstValueFrom(this.httpService.get(translateApiUrl));
    } catch (e) {
      return false;
    }

    return true;
  }

  async fetchAvailableTranslationLanguages(): Promise<GetAvailableLanguagesResponse> {
    const translateApiUrl = this.configService.get("LIBRE_TRANSLATE_API_URL");

    let response: AxiosResponse<GetAvailableLanguagesResponse>;

    try {
      response = await firstValueFrom(
        this.httpService.get(`${translateApiUrl}/languages`),
      );
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch available languages from LibreTranslate API: ${e.message}`,
      );
    }

    if (response.status !== 200) {
      throw new InternalServerErrorException(
        "Failed to fetch available languages from LibreTranslate API",
      );
    }

    return response.data;
  }

  async importTranslationLanguages() {
    const forkedEntityManager = this.entityManager.fork();
    const forkedLanguageRepository =
      forkedEntityManager.getRepository(Language);

    const existingLanguages = await forkedLanguageRepository.findAll();

    const availableTranslations =
      await this.fetchAvailableTranslationLanguages();

    const languages: Partial<Language>[] = availableTranslations.map(
      (language) => {
        return {
          code: language.code,
          name: language.name,
        };
      },
    );

    const availableEnglishTranslationsTargets = availableTranslations.find(
      (translation) => {
        return translation.code === "en";
      },
    ).targets;

    const newAvailableEnglishTranslationLanguages = languages.filter(
      (language) => {
        return (
          availableEnglishTranslationsTargets.includes(language.code) &&
          !existingLanguages.some(
            (existingLanguage) => existingLanguage.code === language.code,
          )
        );
      },
    );

    newAvailableEnglishTranslationLanguages.forEach((language) => {
      forkedLanguageRepository.create(language);
    });

    await forkedEntityManager.flush();
  }

  async translate(request: GetTranslatedTextRequest): Promise<string[]> {
    const translateApiUrl = this.configService.get("LIBRE_TRANSLATE_API_URL");

    let response: AxiosResponse<GetTranslatedTextResponse>;

    try {
      response = await firstValueFrom(
        this.httpService.post(`${translateApiUrl}/translate`, {
          ...request,
        }),
      );
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch available languages from LibreTranslate API: ${e.message}`,
      );
    }

    if (response.status !== 200) {
      throw new InternalServerErrorException(
        "Failed to fetch available languages from LibreTranslate API",
      );
    }

    return response.data.translatedText;
  }

  async getSupportedLanguages(): Promise<Language[]> {
    return this.languageRepository.findAll();
  }

  async checkIfTranslationLanguageIsSupported(languageCode: string) {
    const languageCount = await this.languageRepository.count({
      code: languageCode,
    });

    return languageCount > 0;
  }

  async translateArticles({
    articles,
    targetLanguageCode,
  }: TranslateArticleOptions): Promise<Partial<Article>[]> {
    const textsToTranslate = articles.reduce(
      (accumulatedTextsToTranslate, article) => {
        if (article.articleType === ArticleType.News) {
          return [
            ...accumulatedTextsToTranslate,
            article.title,
            article.extract,
            "",
          ];
        }

        return [
          ...accumulatedTextsToTranslate,
          article.title,
          article.extract,
          article.context ?? "",
        ];
      },
      [],
    );

    const htmlToTranslate = articles.reduce(
      (accumulatedHtmlToTranslate, article) => {
        if (article.articleType === ArticleType.OnThisDay) {
          return [...accumulatedHtmlToTranslate, article.extractHtml, ""];
        }

        return [
          ...accumulatedHtmlToTranslate,
          article.extractHtml,
          article.context ?? "",
        ];
      },
      [],
    );

    const translatedTextsPromise = this.translate({
      q: textsToTranslate,
      target: targetLanguageCode,
      source: "en",
      format: "text",
    });

    const translatedHtmlPromise = this.translate({
      q: htmlToTranslate,
      target: targetLanguageCode,
      source: "en",
      format: "html",
    });

    const [translatedTexts, translatedHtml] = await Promise.all([
      translatedTextsPromise,
      translatedHtmlPromise,
    ]);

    const translatedArticles: Partial<Article>[] = [];

    articles.forEach((article) => {
      const [title, extract, context] = translatedTexts.splice(0, 3);
      const [extractHtml, contextHtml] = translatedHtml.splice(0, 2);

      let articleContext = context || contextHtml;

      if (articleContext.length === 0) articleContext = null;

      translatedArticles.push({
        articleType: article.articleType,
        articleUrl: article.articleUrl,
        wikipediaPageId: article.wikipediaPageId,
        thumbnail: article.thumbnail,
        title,
        extract,
        extractHtml,
        context: articleContext,
      });
    });

    return translatedArticles;
  }
}
