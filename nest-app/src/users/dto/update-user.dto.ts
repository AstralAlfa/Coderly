import {
    IsString,
    IsOptional,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @IsOptional()
    @IsString()
    @MaxLength(300)
    bio?: string;

    @IsOptional()
    @IsUrl()
    githubUrl?: string;
}
