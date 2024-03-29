import { Pagination } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useFeed } from "../../api/useFeed";
import { ArticleCard } from "../ArticleCard/ArticleCard";

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
  const { data } = useGetFeedQuery({
    date,
    languageCode,
    ...pagination,
  });

  const containerClass = classNames("article-feed", className);

  return (
    <div className={containerClass}>
      {data?.items.map((article) => <ArticleCard article={article} />)}
      <Pagination />
    </div>
  );
};
