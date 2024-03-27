import { Entity, Enum, OneToOne, Property } from "@mikro-orm/core";
import { ArticleType } from "../../common/@types/enum/article-type.enum";
import { BaseEntity } from "../../common/database/base.entity";
import { Thumbnail } from "./thumbnail.entity";

@Entity({ tableName: "articles" })
export class Article extends BaseEntity {
  @Property()
  title: string;

  @Property()
  extract: string;

  @Property({ name: "article_url" })
  articleUrl: string;

  @Enum({ name: "article_type", items: () => ArticleType })
  articleType: string;

  @Property({ name: "wikipedia_page_id" })
  wikipediaPageId: string;

  @Property({ name: "featured_date", type: "date" })
  featuredDate: Date;

  @OneToOne({
    joinColumn: "thumbnail_id",
    owner: true,
    orphanRemoval: true,
  })
  thumbnail: Thumbnail;
}
