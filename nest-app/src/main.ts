import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err: unknown) => {
    console.error('Error starting the application:', err);
    process.exit(1);
});
