import { Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../common/database/base.entity";
import { ArticleCollection } from "./article-collection.entity";

@Entity({ tableName: "languages" })
export class Language extends BaseEntity {
  @Property()
  name: string;

  @Property()
  code: string;

  @OneToMany(
    () => ArticleCollection,
    (articleCollection) => articleCollection.language,
    {
      orphanRemoval: false,
      eager: false,
    },
  )
  articleCollections: ArticleCollection[];
}
