import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlpha,
  IsISO8601,
  IsLowercase,
  IsString,
  Length,
} from "class-validator";
import { startOfToday } from "date-fns";
import { MaxIsoDate } from "../../../common/decorators/max-iso-date.decorator";

export class GetTranslatedFeedParamsDto {
  @ApiProperty({
    type: "string",
    description: "Date in ISO8601 format without time",
  })
  @MaxIsoDate(() => startOfToday(), {
    message: "date must not be greater than today",
  })
  @IsISO8601({ strict: true })
  date: string;

  @ApiProperty({
    type: "string",
    description: "Language code",
  })
  @Length(2, 2)
  @IsLowercase()
  @IsAlpha()
  @IsString()
  languageCode: string;
}
