import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { CreateContactRequestDto } from './dto/create-contact-requests.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../users/dto/authentical-req.interface';

@UseGuards(JwtAuthGuard)
@Controller('contact-requests')
export class ContactRequestsController {
    constructor(private service: ContactRequestsService) {}

    @Post()
    async create(
        @Body() dto: CreateContactRequestDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.service.create(req.user.id, dto.recipientId);
    }

    @Get('incoming')
    async incoming(@Req() req: AuthenticatedRequest) {
        return this.service.findIncoming(req.user.id);
    }

    @Get('outgoing')
    async outgoing(@Req() req: AuthenticatedRequest) {
        return this.service.findOutgoing(req.user.id);
    }

    @Get('accepted')
    async accepted(@Req() req: AuthenticatedRequest) {
        return this.service.findAccepted(req.user.id);
    }

    @Patch(':id/accept')
    async accept(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        return this.service.respond(id, req.user.id, true);
    }

    @Patch(':id/decline')
    async decline(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        return this.service.respond(id, req.user.id, false);
    }
}
