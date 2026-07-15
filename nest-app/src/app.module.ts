import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        AuthModule,
        TagsModule,
        ProjectsModule,
    ],
})
export class AppModule {}
