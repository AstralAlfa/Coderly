import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MailService {
    private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';

    async sendVerificationEmail(to: string, username: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        await axios.post(
            this.apiUrl,
            {
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                    name: 'Coderly',
                },
                to: [{ email: to, name: username }],
                subject: 'Подтверди почту на Coderly',
                htmlContent: `
                    <p>Привет, ${username}!</p>
                    <p>Подтверди свою почту, чтобы начать пользоваться Coderly:</p>
                    <a href="${verifyUrl}">${verifyUrl}</a>
                    <p>Ссылка действительна 24 часа.</p>
                `,
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}
