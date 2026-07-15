import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../users/dto/authentical-req.interface';
import { FindProjectsQueryDto } from './dto/find-projects-query.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() dto: CreateProjectDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.projectsService.create(dto, req.user.id);
    }

    @Get()
    async findAll(@Query() query: FindProjectsQueryDto) {
        return this.projectsService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProjectDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.projectsService.update(id, dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        return this.projectsService.remove(id, req.user.id);
    }
}
