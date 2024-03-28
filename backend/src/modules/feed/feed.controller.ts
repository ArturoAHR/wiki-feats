import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { startOfToday } from "date-fns";
import { getIsoDate } from "../../common/helpers/iso-date.utils";
import { GetFeedParamsDto } from "./dto/get-feed.param.dto";
import { GetFeedQueryDto } from "./dto/get-feed.query.dto";
import { GetFeedResponseDto } from "./dto/get-feed.response.dto";
import { FeedService } from "./feed.service";

@ApiTags("feed")
@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @ApiOperation({ summary: "Get today's featured wikipedia articles" })
  @ApiResponse({ type: GetFeedResponseDto })
  async getCurrentFeed(
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    const today = getIsoDate(startOfToday());

    const options = {
      page: query?.page,
      pageSize: query?.pageSize,
    };

    return await this.feedService.getFeedArticles(today, options);
  }

  @Get("/:date")
  @ApiOperation({ summary: "Get featured wikipedia articles from a past date" })
  @ApiResponse({ type: GetFeedResponseDto })
  async getFeedByDate(
    @Param() params: GetFeedParamsDto,
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    const { date } = params;

    const options = {
      page: query?.page,
      pageSize: query?.pageSize,
    };

    return await this.feedService.getFeedArticles(date, options);
  }
}
