import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContactRequestStatus } from '@prisma/client';

@Injectable()
export class ContactRequestsService {
    constructor(private prisma: PrismaService) {}

    async create(requesterId: string, recipientId: string) {
        if (requesterId === recipientId) {
            throw new BadRequestException(
                'Нельзя отправить запрос самому себе',
            );
        }

        const recipient = await this.prisma.user.findUnique({
            where: { id: recipientId },
        });
        if (!recipient) {
            throw new NotFoundException('Пользователь не найден');
        }

        const existing = await this.prisma.contactRequest.findUnique({
            where: { requesterId_recipientId: { requesterId, recipientId } },
        });
        if (existing) {
            throw new ConflictException('Запрос на контакт уже отправлен');
        }

        return this.prisma.contactRequest.create({
            data: { requesterId, recipientId },
            include: {
                requester: { select: { id: true, username: true } },
                recipient: { select: { id: true, username: true } },
            },
        });
    }

    async findIncoming(userId: string) {
        return this.prisma.contactRequest.findMany({
            where: {
                recipientId: userId,
                status: ContactRequestStatus.PENDING,
            },
            include: {
                requester: { select: { id: true, username: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOutgoing(userId: string) {
        return this.prisma.contactRequest.findMany({
            where: { requesterId: userId },
            include: {
                recipient: { select: { id: true, username: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAccepted(userId: string) {
        return this.prisma.contactRequest.findMany({
            where: {
                status: ContactRequestStatus.ACCEPTED,
                OR: [{ requesterId: userId }, { recipientId: userId }],
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        phone: true,
                        telegramUsername: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        username: true,
                        phone: true,
                        telegramUsername: true,
                    },
                },
            },
        });
    }

    async respond(requestId: string, userId: string, accept: boolean) {
        const request = await this.prisma.contactRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Запрос на контакт не найден');
        }

        if (request.recipientId !== userId) {
            throw new ForbiddenException(
                'Вы не можете отклонить или принять этот запрос',
            );
        }

        if (request.status !== ContactRequestStatus.PENDING) {
            throw new BadRequestException('Этот запрос уже был обработан');
        }

        return this.prisma.contactRequest.update({
            where: { id: requestId },
            data: {
                status: accept
                    ? ContactRequestStatus.ACCEPTED
                    : ContactRequestStatus.DECLINED,
            },
            include: {
                requester: { select: { id: true, username: true } },
                recipient: { select: { id: true, username: true } },
            },
        });
    }
}
