import { ArticleFeed } from "../../components/article-feed/ArticleFeed";

import "./Feed.css";

export const Feed = () => {
  return (
    <div className="feed-page-content">
      <div className="feed-header">Featured Article Feed</div>
      <div className="feed-section-separator"></div>
      <ArticleFeed date="2024-03-29" />
    </div>
  );
};
