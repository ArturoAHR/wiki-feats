import { Card } from "antd";
import classNames from "classnames";
import { useSanitizeHtml } from "../../../utility/hooks/useSanitizeHtml";
import { Article } from "../../types/article";

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
      <img src={article?.thumbnail?.source ?? ""} alt={article.title} />
      <div className="article-card-title">{article.title}</div>
      <div
        className="article-card-extract"
        dangerouslySetInnerHTML={sanitize(article.extractHtml)}
      ></div>
      {article?.context && (
        <div
          className="article-card-context"
          dangerouslySetInnerHTML={sanitize(article.context)}
        ></div>
      )}
    </Card>
  );
};
