import { createMock } from "@golevelup/ts-jest";
import { MikroORM } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { OrmService } from "./orm.service";

describe("OrmService", () => {
  let service: OrmService;
  const mockMikroOrm = createMock<MikroORM>({
    getMigrator: jest.fn().mockReturnValue({
      up: jest.fn(),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrmService, { provide: MikroORM, useValue: mockMikroOrm }],
    }).compile();

    service = module.get<OrmService>(OrmService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should run migrations on initialization", () => {
    service.onModuleInit();

    expect(mockMikroOrm.getMigrator().up).toHaveBeenCalled();
  });
});
