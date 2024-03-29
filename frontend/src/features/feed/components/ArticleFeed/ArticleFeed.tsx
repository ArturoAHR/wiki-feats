import { Pagination } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useFeed } from "../../api/useFeed";
import { ArticleCard } from "../ArticleCard/ArticleCard";

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
  const [pagination, setPagination] = useState({ page: 9, pageSize: 5 });

  const { useGetFeedQuery } = useFeed();
  const { data, isLoading } = useGetFeedQuery({
    date,
    languageCode,
    ...pagination,
  });

  const handlePageChange = (page: number) =>
    setPagination({ ...pagination, page });

  const handlePageSizeChange = (_page: number, pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  const containerClass = classNames("article-feed", className);

  return (
    <div className={containerClass}>
      <div className="article-feed-articles">
        {data?.items.map((article) => <ArticleCard article={article} />)}
      </div>
      <Pagination
        className="article-feed-pagination"
        simple
        total={data?.meta.total ?? 0}
        onChange={handlePageChange}
        showSizeChanger
        onShowSizeChange={handlePageSizeChange}
        pageSizeOptions={[5, 10, 20]}
        defaultPageSize={5}
        disabled={isLoading}
      />
    </div>
  );
};
