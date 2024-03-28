import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationQueryDto {
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 5;
}
