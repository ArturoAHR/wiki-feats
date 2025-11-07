import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { WikipediaService } from "./wikipedia.service";

@Module({
  imports: [
    HttpModule.register({
      headers: {
        "User-Agent": `wiki-feats-backend/0.0.1 (${process.env.CONTACT_URL}) axios/1.6.8`,
      },
    }),
  ],
  providers: [WikipediaService],
  exports: [WikipediaService],
})
export class WikipediaModule {}
