import { createMock } from "@golevelup/ts-jest";
import { EntityManager } from "@mikro-orm/postgresql";
import { Article } from "../../database/entities/article.entity";
import { BaseRepository } from "./base.repository";

describe("Base Repository", () => {
  const mockEm = createMock<EntityManager>({
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
  });

  const articleRepository = new BaseRepository(mockEm, Article);

  it("should be defined", () => {
    expect(articleRepository).toBeDefined();
  });

  it("should return paginated result", async () => {
    const pagination = { page: 1, pageSize: 10 };
    const result = await articleRepository.findPaginated(pagination);

    expect(result).toEqual({
      items: [],
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
    });
  });

  it("should soft deleted entity", () => {
    const article = new Article();

    articleRepository.softRemove(article);

    expect(article.deletedAt).not.toBeNull();
  });

  it("should soft delete and flush entity", async () => {
    const article = new Article();

    await articleRepository.softRemoveAndFlush(article);

    expect(mockEm.flush).toHaveBeenCalled();
    expect(article.deletedAt).not.toBeNull();
  });
});
