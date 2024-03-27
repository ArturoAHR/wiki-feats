import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { ArticleType } from "../../common/@types/enum/article-type.enum";
import { WikipediaApiResponse } from "./types/wikipedia-api-response.types";
import { WikipediaArticle } from "./types/wikipedia-article.types";

@Injectable()
export class WikipediaService {
  constructor(private readonly httpService: HttpService) {}

  async fetchFeaturedContents(date: string): Promise<WikipediaArticle[]> {
    const uriDate = date.split("-").join("/");

    const response: AxiosResponse<WikipediaApiResponse> = await firstValueFrom(
      this.httpService.get(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${uriDate}`,
      ),
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data from Wikipedia API");
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

    return articles;
  }
}
