import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationQueryDto {
  @ApiProperty({ type: "number" })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ type: "number" })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 5;
}
