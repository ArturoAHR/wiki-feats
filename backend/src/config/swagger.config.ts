import { DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";
import "dotenv/config";

export const swaggerConfig: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
  .setTitle(process.env.SWAGGER_TITLE)
  .setDescription(process.env.SWAGGER_DESCRIPTION)
  .setVersion(process.env.SWAGGER_VERSION)
  .build();
