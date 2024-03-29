import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsLowercase, IsString, Length } from "class-validator";

export class GetTranslatedFeedParamsDto {
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
