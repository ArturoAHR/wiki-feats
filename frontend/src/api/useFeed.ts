import { useQuery } from "react-query";
import { useAxios } from "../hooks/useAxios";
import { Article, GetFeedArticlesParams } from "../types/article";
import { GetAvailableFeedLanguagesResponse } from "../types/language";
import { PaginatedResponse } from "../types/pagination";

export const useFeed = () => {
  const { axios } = useAxios();
  const URL = "/feed";

  const useGetFeedQuery = (params: GetFeedArticlesParams) => {
    params.page = params?.page ?? 1;
    params.pageSize = params?.pageSize ?? 5;
    params.languageCode = params?.languageCode ?? "en";

    return useQuery(
      [
        "feed",
        `feed-${params.date}-${params.languageCode}-${params.page}-${params.pageSize}`,
      ],
      async (): Promise<PaginatedResponse<Article>> => {
        const response = await axios.get(
          `${URL}/${params.date}/translate/${params.languageCode}`,
          { params: { page: params.page, pageSize: params.pageSize } },
        );

        return response.data;
      },
    );
  };

  const useGetAvailableFeedLanguages = () => {
    return useQuery(
      ["feed-languages"],
      async (): Promise<GetAvailableFeedLanguagesResponse> => {
        const response = await axios.get(`${URL}/languages`);

        return response.data;
      },
    );
  };

  return { useGetFeedQuery, useGetAvailableFeedLanguages };
};
