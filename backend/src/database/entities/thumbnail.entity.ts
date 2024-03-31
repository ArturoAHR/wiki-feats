import { Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../common/database/base.entity";
import { Article } from "./article.entity";

@Entity({ tableName: "thumbnails" })
export class Thumbnail extends BaseEntity {
  @Property({ type: "text" })
  url: string;

  @Property()
  width: number;

  @Property()
  height: number;

  @OneToMany(() => Article, (article) => article.thumbnail, {
    orphanRemoval: false,
    eager: false,
  })
  articles: Article[];
}
