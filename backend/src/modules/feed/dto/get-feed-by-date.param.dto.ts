import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601 } from "class-validator";
import { startOfToday } from "date-fns";
import { MaxIsoDate } from "../../../common/decorators/max-iso-date.decorator";

export class GetFeedByDateParamsDto {
  @ApiProperty({
    type: "string",
    description: "Date in ISO8601 format without time",
  })
  @MaxIsoDate(() => startOfToday(), {
    message: "date must not be greater than today",
  })
  @IsISO8601({ strict: true })
  date: string;
}
