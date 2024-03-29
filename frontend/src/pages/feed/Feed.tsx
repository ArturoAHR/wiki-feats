import { ArticleFeed } from "../../features/feed/components/ArticleFeed/ArticleFeed";

export const Feed = () => {
  return (
    <div className="feed-page-content">
      <div className="feed-header">Featured Article Feed</div>
      <ArticleFeed date="2024-03-29" />
    </div>
  );
};
