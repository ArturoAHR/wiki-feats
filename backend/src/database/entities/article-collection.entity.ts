import { Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../common/database/base.entity";
import { Article } from "./article.entity";
import { Language } from "./language.entity";

@Entity({ tableName: "article_collections" })
export class ArticleCollection extends BaseEntity {
  @Property({ name: "featured_date", type: "date" })
  featuredDate: Date;

  @Property({ name: "available_articles", type: "integer" })
  availableArticles: number;

  @Property({ name: "total_articles", type: "integer" })
  totalArticles: number;

  @ManyToOne({ entity: () => Language, joinColumn: "language_id", eager: true })
  language: Language;

  @OneToMany(() => Article, (article) => article.articleCollection, {
    orphanRemoval: true,
    eager: false,
  })
  articles: Article[];
}
