import { MikroOrmModule } from "@mikro-orm/nestjs";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { Language } from "../../database/entities/language.entity";
import { TranslateController } from "./translate.controller";
import { TranslateService } from "./translate.service";

@Module({
  imports: [MikroOrmModule.forFeature([Language]), HttpModule],
  providers: [TranslateService],
  controllers: [TranslateController],
  exports: [TranslateService],
})
export class TranslateModule {}
