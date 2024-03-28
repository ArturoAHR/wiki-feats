import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { BaseRepository } from "../../common/database/base.repository";
import { Language } from "../../database/entities/language.entity";
import { GetAvailableLanguagesResponse } from "./types/libre-translate-api-response.types";

@Injectable()
export class TranslateService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Language)
    private readonly languageRepository: BaseRepository<Language>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const languageCount = await this.languageRepository.count();

    if (languageCount > 0) return;

    await this.importTranslationLanguages();
  }

  async fetchAvailableTranslationLanguages(): Promise<GetAvailableLanguagesResponse> {
    const translateApiUrl = this.configService.get("LIBRE_TRANSLATE_API_URL");

    let response: AxiosResponse<GetAvailableLanguagesResponse>;

    try {
      response = await firstValueFrom(
        this.httpService.get(`${translateApiUrl}/languages`),
      );
    } catch (e) {
      throw new Error(
        `Failed to fetch available languages from LibreTranslate API: ${e.message}`,
      );
    }

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch available languages from LibreTranslate API",
      );
    }

    return response.data;
  }

  async importTranslationLanguages() {
    const forkedEm = this.em.fork();
    const forkedLanguageRepository = forkedEm.getRepository(Language);

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

    const availableEnglishTranslationLanguages = languages.filter(
      (language) => {
        return availableEnglishTranslationsTargets.includes(language.code);
      },
    );

    availableEnglishTranslationLanguages.forEach((language) => {
      forkedLanguageRepository.create(language);
    });

    await forkedEm.flush();
  }
}
