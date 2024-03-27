import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../common/database/base.entity";

@Entity({ tableName: "thumbnails" })
export class Thumbnail extends BaseEntity {
  @Property({ type: "text" })
  url: string;

  @Property()
  width: number;

  @Property()
  height: number;
}
