import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindOptions,
} from "@mikro-orm/postgresql";
import {
  PaginatedFindResult,
  Pagination,
} from "../@types/types/pagination.types";
import { BaseEntity } from "./base.entity";

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  async findPaginated(
    { page, pageSize }: Pagination,
    conditions: FilterQuery<T> = {},
    options: Omit<FindOptions<T>, "fields"> = {},
  ): Promise<PaginatedFindResult<T>> {
    const [items, total] = await this.findAndCount(conditions, {
      ...options,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

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
