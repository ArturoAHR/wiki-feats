import { Card } from "antd";
import classNames from "classnames";
import { useSanitizeHtml } from "../../hooks/useSanitizeHtml";
import { Article } from "../../types/article";
import WikipediaIcon from "./../../assets/wikipedia-icon.jpg";

import { ImageWithFallback } from "../image-with-fallback/ImageWithFallback";
import "./ArticleCard.css";

export type ArticleCardProps = {
  article: Article;
  alreadyRead?: boolean;
  className?: string;
};

export const ArticleCard = ({
  article,
  alreadyRead,
  className,
}: ArticleCardProps) => {
  const { sanitize } = useSanitizeHtml();

  const cardClassName = classNames("article-card", className, {
    "article-card-read": alreadyRead,
  });

  return (
    <Card className={cardClassName} key={article.id}>
      <ImageWithFallback
        src={article?.thumbnail?.url}
        alt={article.title}
        fallback={WikipediaIcon}
        className="article-card-image"
      />
      <div className="article-card-separator"></div>
      <div className="article-card-title">{article.title}</div>
      {article?.context && (
        <div
          className="article-card-context"
          dangerouslySetInnerHTML={sanitize(article.context)}
        ></div>
      )}
      <div
        className="article-card-extract"
        dangerouslySetInnerHTML={sanitize(article.extractHtml)}
      ></div>
    </Card>
  );
};
