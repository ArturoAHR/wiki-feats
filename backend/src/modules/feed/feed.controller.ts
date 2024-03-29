import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetFeedByDateParamsDto } from "./dto/get-feed-by-date.param.dto";
import { GetFeedQueryDto } from "./dto/get-feed.query.dto";
import { GetFeedResponseDto } from "./dto/get-feed.response.dto";
import { GetTranslatedFeedParamsDto } from "./dto/get-translated-feed.param.dto";
import { FeedService } from "./feed.service";

@ApiTags("feed")
@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get("translate/:languageCode")
  @ApiOperation({
    summary: "Get featured Wikipedia articles in the given language",
  })
  @ApiResponse({ type: GetFeedResponseDto })
  async getTranslatedFeed(
    @Param() params: GetTranslatedFeedParamsDto,
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    return await this.feedService.getFeedArticles({
      ...params,
      ...query,
    });
  }

  @Get()
  @ApiOperation({ summary: "Get today's featured Wikipedia articles" })
  @ApiResponse({ type: GetFeedResponseDto })
  async getCurrentFeed(
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    return await this.feedService.getFeedArticles({
      ...query,
    });
  }

  @Get(":date")
  @ApiOperation({ summary: "Get featured Wikipedia articles from a past date" })
  @ApiResponse({ type: GetFeedResponseDto })
  async getFeedByDate(
    @Param() params: GetFeedByDateParamsDto,
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    return await this.feedService.getFeedArticles({
      ...params,
      ...query,
    });
  }

  @Get(":date/translate/:languageCode")
  @ApiOperation({
    summary: "Get featured Wikipedia articles in the given language",
  })
  @ApiResponse({ type: GetFeedResponseDto })
  async getTranslatedFeedByDate(
    @Param() params: GetTranslatedFeedParamsDto & GetFeedByDateParamsDto,
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    return await this.feedService.getFeedArticles({
      ...params,
      ...query,
    });
  }
}
