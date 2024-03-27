import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property({ name: "created_at" })
  createdAt = new Date();

  @Property({ name: "updated_at", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ name: "deleted_at", nullable: true })
  deletedAt: Date | null = null;
}
