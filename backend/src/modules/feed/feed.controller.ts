import { Controller, Get, Param, Query } from "@nestjs/common";
import { startOfToday } from "date-fns";
import { GetFeedParamsDto } from "./dto/get-feed.param.dto";
import { GetFeedQueryDto } from "./dto/get-feed.query.dto";
import { GetFeedResponseDto } from "./dto/get-feed.response.dto";
import { FeedService } from "./feed.service";

@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getCurrentFeed(
    @Query() query: GetFeedQueryDto,
  ): Promise<GetFeedResponseDto> {
    const today = startOfToday().toISOString().split("T")[0];

    const options = {
      page: query?.page,
      pageSize: query?.pageSize,
    };

    return await this.feedService.getFeedArticles(today, options);
  }

  @Get("/:date")
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
