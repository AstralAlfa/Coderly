import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateUserDto) {
        return this.prisma.user.create({
            data: dto,
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) throw new NotFoundException('Пользователь не найден');
        return user;
    }

    async findByUsername(username: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (!user) throw new NotFoundException('Пользователь не найден');
        return user;
    }

    async findByUsernameOrNull(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async update(id: string, dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }
}
