import { IsUUID } from 'class-validator';

export class CreateContactRequestDto {
    @IsUUID()
    recipientId!: string;
}
