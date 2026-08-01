import { Module } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestsController } from './contact-requests.controller';

@Module({
    controllers: [ContactRequestsController],
    providers: [ContactRequestsService],
})
export class ContactRequestsModule {}
