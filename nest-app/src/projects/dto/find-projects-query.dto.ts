import { IsOptional, IsEnum, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProjectStatus } from '@prisma/client';

export class FindProjectsQueryDto {
    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @Transform(({ value }: { value: string | string[] | undefined }) => {
        if (value === undefined || value === null) {
            return value;
        }

        return Array.isArray(value) ? value : [value];
    })
    @IsArray()
    @IsString({ each: true })
    tagIds?: string[];
}
