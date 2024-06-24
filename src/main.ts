import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from 'dotenv'
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


async function start() {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
    .setTitle('Project trello')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addTag('rubbenc')
    .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    await app.listen(PORT, ()=>{
        console.log(`Server started on port = ${PORT}`)
    })
}

start()
