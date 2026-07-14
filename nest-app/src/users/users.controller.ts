import { Controller, Get, Patch, Body, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import type { AuthenticatedRequest } from './dto/authentical-req.interface';
import { UserEntity } from './dto/user.entity';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':username')
    async getProfile(@Param('username') username: string) {
        const user = await this.usersService.findByUsername(username);
        return new UserEntity(user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.update(req.user.id, dto);
    }
}
