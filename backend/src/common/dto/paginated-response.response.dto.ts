import { PaginationMetadataResponseDto } from "./pagination-metadata.response.dto";

export class PaginatedResponseDto<T> {
  items: T[];

  meta: PaginationMetadataResponseDto;
}
