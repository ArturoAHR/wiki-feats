import { ApiResponseProperty } from "@nestjs/swagger";

export class PaginationMetadataResponseDto {
  @ApiResponseProperty({ type: "number", example: 4 })
  page: number;

  @ApiResponseProperty({ type: "number", example: 5 })
  pageSize: number;

  @ApiResponseProperty({ type: "number", example: 100 })
  total: number;

  @ApiResponseProperty({ type: "number", example: 20 })
  totalPages: number;
}
