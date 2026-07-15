import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateProjectDto, ownerId: string) {
        const { tagIds, ...projectData } = dto;

        return this.prisma.project.create({
            data: {
                ...projectData,
                owner: { connect: { id: ownerId } },
                tags: { connect: tagIds.map((id) => ({ id })) },
            },
            include: {
                owner: { select: { id: true, username: true } },
                tags: true,
            },
        });
    }

    async findAll(filters?: { status?: ProjectStatus; tagIds?: string[] }) {
        return this.prisma.project.findMany({
            where: {
                status: filters?.status,
                tags: filters?.tagIds
                    ? { some: { id: { in: filters.tagIds } } }
                    : undefined,
            },
            include: {
                owner: { select: { id: true, username: true } },
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                owner: { select: { id: true, username: true } },
                tags: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Проект не найден');
        }

        return project;
    }

    async update(id: string, dto: UpdateProjectDto, userId: string) {
        const project = await this.findOne(id);

        if (project.owner.id !== userId) {
            throw new ForbiddenException(
                'Вы не можете редактировать чужой проект',
            );
        }

        const { tagIds, ...projectData } = dto;

        return this.prisma.project.update({
            where: { id },
            data: {
                ...projectData,
                tags: tagIds
                    ? { set: tagIds.map((tagId) => ({ id: tagId })) }
                    : undefined,
            },
            include: {
                owner: { select: { id: true, username: true } },
                tags: true,
            },
        });
    }

    async remove(id: string, userId: string) {
        const project = await this.findOne(id);

        if (project.owner.id !== userId) {
            throw new ForbiddenException('Вы не можете удалить чужой проект');
        }

        return this.prisma.project.delete({ where: { id } });
    }
}
