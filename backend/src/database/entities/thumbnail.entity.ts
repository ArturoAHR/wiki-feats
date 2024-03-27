import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity({ tableName: "thumbnails" })
export class Thumbnail extends BaseEntity {
  @Property()
  url: string;

  @Property()
  width: number;

  @Property()
  height: number;
}
