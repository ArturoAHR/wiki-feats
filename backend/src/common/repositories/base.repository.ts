import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BaseEntity } from "../entities/base.entity";

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  softRemove(entity: T): EntityManager {
    entity.deletedAt = new Date();
    this.em.persist(entity);

    return this.em;
  }

  async softRemoveAndFlush(entity: T): Promise<T> {
    this.softRemove(entity);
    await this.em.flush();

    return entity;
  }
}
