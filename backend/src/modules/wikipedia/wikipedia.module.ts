import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { WikipediaService } from "./wikipedia.service";

@Module({
  imports: [HttpModule],
  providers: [WikipediaService],
  exports: [WikipediaService],
})
export class WikipediaModule {}
