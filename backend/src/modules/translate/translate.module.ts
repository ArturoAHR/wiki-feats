import { MikroOrmModule } from "@mikro-orm/nestjs";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { Language } from "../../database/entities/language.entity";
import { OrmModule } from "../../lib/orm/orm.module";
import { TranslateService } from "./translate.service";

@Module({
  imports: [MikroOrmModule.forFeature([Language]), HttpModule, OrmModule],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
