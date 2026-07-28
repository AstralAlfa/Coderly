import {
    IsEmail,
    MaxLength,
    IsString,
    MinLength,
    IsOptional,
    IsDate,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password!: string;

    @IsOptional()
    @IsString()
    verificationToken?: string;

    @IsOptional()
    @IsDate()
    verificationTokenExpiresAt?: Date;
}
