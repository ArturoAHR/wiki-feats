import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { ArticleType } from "../../common/@types/enum/article-type.enum";
import { BaseEntity } from "../../common/database/base.entity";
import { ArticleCollection } from "./article-collection.entity";
import { Thumbnail } from "./thumbnail.entity";

@Entity({ tableName: "articles" })
export class Article extends BaseEntity {
  @Property()
  title: string;

  @Property({ type: "text" })
  extract: string;

  @Property({ name: "extract_html", type: "text" })
  extractHtml: string;

  @Property({ type: "text", nullable: true })
  context?: string;

  @Property({ name: "article_url", type: "text" })
  articleUrl: string;

  @Enum({ name: "article_type", items: () => ArticleType })
  articleType: ArticleType;

  @Property({ name: "wikipedia_page_id" })
  wikipediaPageId: number;

  @ManyToOne({
    joinColumn: "thumbnail_id",
    eager: true,
    nullable: true,
  })
  thumbnail: Thumbnail;

  @ManyToOne({ entity: () => ArticleCollection, joinColumn: "collection_id" })
  articleCollection: ArticleCollection;
}
