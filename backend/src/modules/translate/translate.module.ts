import { MikroOrmModule } from "@mikro-orm/nestjs";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { Language } from "../../database/entities/language.entity";
import { TranslateService } from "./translate.service";

@Module({
  imports: [MikroOrmModule.forFeature([Language]), HttpModule],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
