import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            bodyLimit: 1024 * 1024,
        }),
    );

    await app.register(helmet);

    await app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err: unknown) => {
    console.error('Error starting the application:', err);
    process.exit(1);
});
