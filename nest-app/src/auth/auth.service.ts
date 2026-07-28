import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {}

    async register(dto: RegisterDto) {
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
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000,
        );

        const user = await this.usersService.create({
            ...dto,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt,
        });

        await this.mailService.sendVerificationEmail(
            user.email,
            user.username,
            verificationToken,
        );

        return {
            message:
                'Регистрация прошла успешно. Проверь почту для подтверждения.',
        };
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

        if (!user.isVerified) {
            throw new ForbiddenException('Подтвердите почту прежде чем войти');
        }

        delete (user as { password?: string }).password;
        return user;
    }

    async verifyEmail(token: string) {
        const user = await this.usersService.findByVerificationToken(token);

        if (
            !user ||
            !user.verificationTokenExpiresAt ||
            user.verificationTokenExpiresAt < new Date()
        ) {
            throw new BadRequestException(
                'Ссылка не действительна или истекла',
            );
        }

        await this.usersService.markAsVerified(user.id);

        return { message: 'Почта подтверждена, теперь можно войти' };
    }

    login(user: { id: string; email: string }): { access_token: string } {
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
