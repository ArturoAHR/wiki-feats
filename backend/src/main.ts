import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Prevents MikroORM from staying connected after the process is terminated.
  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
