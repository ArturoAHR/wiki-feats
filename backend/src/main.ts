import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { swaggerConfig } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const environment = configService.get("ENVIRONMENT");

  if (environment === "development") {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);
  }

  //Prevents MikroORM from staying connected after the process is terminated.
  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  await app.listen(3000);
}
bootstrap();
