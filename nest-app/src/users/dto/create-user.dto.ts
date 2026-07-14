import { IsEmail, MaxLength, IsString, MinLength } from 'class-validator';

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
}
