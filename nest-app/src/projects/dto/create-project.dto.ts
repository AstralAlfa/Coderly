import {
    IsString,
    IsOptional,
    IsEnum,
    IsUrl,
    IsArray,
    MinLength,
    MaxLength,
    ArrayMaxSize,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title!: string;

    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    description!: string;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsUrl()
    githubUrl?: string;

    @IsOptional()
    @IsUrl()
    demoUrl?: string;

    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    tagIds!: string[];
}
