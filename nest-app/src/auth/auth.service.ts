import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto): Promise<{ access_token: string }> {
        const existingEmail = await this.usersService.findByEmail(dto.email);
        if (existingEmail) {
            throw new ConflictException('Email уже используется');
        }

        const existingUsername = await this.usersService.findByUsernameOrNull(
            dto.username,
        );
        if (existingUsername) {
            throw new ConflictException('Имя пользователя уже используется');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            ...dto,
            password: hashedPassword,
        });

        return this.login(user);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        delete (user as { password?: string }).password;
        return user;
    }

    login(user: { id: string; email: string }): { access_token: string } {
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
