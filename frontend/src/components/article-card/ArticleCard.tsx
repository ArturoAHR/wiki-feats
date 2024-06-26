import { Card } from "antd";
import classNames from "classnames";
import { useSanitizeHtml } from "../../hooks/useSanitizeHtml";
import { Article, articleTypeToTitle } from "../../types/article";
import WikipediaIcon from "./../../assets/wikipedia-icon.jpg";

import { ImageWithFallback } from "../image-with-fallback/ImageWithFallback";
import "./ArticleCard.css";

export type ArticleCardProps = {
  article: Article;
  alreadyRead?: boolean;
  onClick?: (article: Article) => void;
  className?: string;
};

export const ArticleCard = ({
  article,
  alreadyRead,
  onClick,
  className,
}: ArticleCardProps) => {
  const { sanitize } = useSanitizeHtml();

  const handleClick = () => {
    window.open(article.articleUrl, "_blank");
    if (onClick) onClick(article);
  };

  const cardClassName = classNames("article-card", className, {
    "article-card-read": alreadyRead,
  });

  return (
    <Card
      data-testid="article-card"
      className={cardClassName}
      onClick={handleClick}
      title={articleTypeToTitle[article.articleType]}
    >
      <ImageWithFallback
        src={article?.thumbnail?.url}
        alt={article.title}
        fallback={WikipediaIcon}
        className="article-card-image"
      />
      <div className="article-card-separator" />
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
