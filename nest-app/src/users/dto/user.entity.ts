import { Exclude } from 'class-transformer';

export class UserEntity {
    id!: string;
    username!: string;
    email!: string;
    bio!: string | null;
    githubUrl!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    @Exclude()
    phone!: string | null;

    @Exclude()
    telegramUsername!: string | null;

    @Exclude()
    password!: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
