import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { ArticleType } from "../../common/@types/enum/article-type.enum";
import { WIKIPEDIA_API_URL } from "../../common/constants/url.contants";
import { WikipediaApiResponse } from "./types/wikipedia-api-response.types";
import { WikipediaArticle } from "./types/wikipedia-article.types";

@Injectable()
export class WikipediaService {
  constructor(private readonly httpService: HttpService) {}

  async fetchFeaturedContents(date: string): Promise<WikipediaArticle[]> {
    const uriDate = date.split("-").join("/");
    let response: AxiosResponse<WikipediaApiResponse>;
    try {
      response = await firstValueFrom(
        this.httpService.get(`${WIKIPEDIA_API_URL}${uriDate}`),
      );
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch data from Wikipedia API: ${e.message}`,
      );
    }

    if (response.status !== 200) {
      throw new InternalServerErrorException(
        "Failed to fetch data from Wikipedia API",
      );
    }

    const articles: WikipediaArticle[] = [];

    articles.push({
      ...response.data.tfa,
      articleType: ArticleType.Featured,
    });

    if (response.data.mostread) {
      response.data.mostread.articles.forEach((article) => {
        articles.push({ ...article, articleType: ArticleType.MostRead });
      });
    }

    if (response.data.onthisday) {
      response.data.onthisday.forEach((onThisDay) => {
        articles.push({
          ...onThisDay.pages[0],
          articleType: ArticleType.OnThisDay,
          text: onThisDay.text,
        });
      });
    }

    if (response.data.news) {
      response.data.news.forEach((news) => {
        articles.push({
          ...news.links[0],
          articleType: ArticleType.News,
          story: news.story,
        });
      });
    }

    return articles;
  }
}
