import { Pagination } from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ArticleCard } from "../article-card/ArticleCard";

import { useFeed } from "../../api/useFeed";
import { Article } from "../../types/article";
import "./ArticleFeed.css";

export type ArticleFeedProps = {
  date: string;
  languageCode?: string;
  className?: string;
};

export const ArticleFeed = ({
  date,
  languageCode,
  className,
}: ArticleFeedProps) => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });

  const { useGetFeedQuery } = useFeed();
  const { data, isLoading } = useGetFeedQuery({
    date,
    languageCode,
    ...pagination,
  });

  const [readArticlesIds, setReadArticlesIds] = useState<number[]>([]);

  useEffect(() => {
    setReadArticlesIds(
      JSON.parse(window.localStorage.getItem("readArticles") || "[]"),
    );
  }, []);

  const handlePageChange = (page: number) => {
    setPagination((previousPagination) => ({ ...previousPagination, page }));
  };
  const handlePageSizeChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  const handleArticleClick = (article: Article) => {
    const articleWikipediaPageId = article.wikipediaPageId;

    window.localStorage.setItem(
      "readArticles",
      JSON.stringify([...readArticlesIds, articleWikipediaPageId]),
    );

    setReadArticlesIds((previousReadArticlesIds) => {
      if (previousReadArticlesIds?.includes(articleWikipediaPageId)) {
        return previousReadArticlesIds;
      }

      return [...previousReadArticlesIds, articleWikipediaPageId];
    });
  };

  const containerClass = classNames("article-feed", className);

  return (
    <div className={containerClass}>
      <div className="article-feed-articles">
        {data?.items.map((article) => (
          <ArticleCard
            article={article}
            key={article.id}
            onClick={handleArticleClick}
            alreadyRead={readArticlesIds.includes(article.wikipediaPageId)}
          />
        ))}
      </div>
      <Pagination
        data-testid="article-feed-pagination"
        className="article-feed-pagination"
        showSizeChanger
        simple
        current={pagination.page}
        pageSize={pagination.pageSize}
        defaultPageSize={5}
        pageSizeOptions={[5, 15, 30]}
        total={data?.meta.total ?? 0}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
        disabled={isLoading}
      />
    </div>
  );
};
