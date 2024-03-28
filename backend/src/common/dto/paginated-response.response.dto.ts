import { ApiResponseProperty } from "@nestjs/swagger";
import { PaginationMetadataResponseDto } from "./pagination-metadata.response.dto";

export class PaginatedResponseDto<T> {
  @ApiResponseProperty({
    type: "array",
    example: [],
  })
  items: T[];

  @ApiResponseProperty({
    type: PaginationMetadataResponseDto,
  })
  meta: PaginationMetadataResponseDto;
}
