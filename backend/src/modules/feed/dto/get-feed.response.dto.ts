import { PaginatedResponseDto } from "../../../common/dto/paginated-response.response.dto";
import { Article } from "../../../database/entities/article.entity";

export class GetFeedResponseDto extends PaginatedResponseDto<Article> {}
