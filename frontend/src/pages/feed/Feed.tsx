import { useState } from "react";
import { ArticleFeedParamsFields } from "../../components/article-feed-params-fields/ArticleFeedParamsFields";
import { ArticleFeed } from "../../components/article-feed/ArticleFeed";

import dayjs from "dayjs";
import { ArticleFeedParams } from "../../types/article";
import "./Feed.css";

export const Feed = () => {
  const [params, setParams] = useState<ArticleFeedParams>({
    date: dayjs().format("YYYY-MM-DD"),
    languageCode: "en",
  });

  return (
    <div className="feed-page-content">
      <div className="feed-header">Featured Article Feed</div>
      <div className="feed-section-separator" />
      <ArticleFeedParamsFields params={params} onParamsChange={setParams} />
      <div className="feed-section-separator" />
      <ArticleFeed date={params.date} languageCode={params.languageCode} />
    </div>
  );
};
