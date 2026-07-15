// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tags = [
    // Языки программирования
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'Dart',
    'C',
    'Scala',
    'Elixir',
    'Lua',

    // Frontend
    'React',
    'Vue',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt.js',
    'Tailwind CSS',
    'Bootstrap',
    'Redux',
    'HTML',
    'CSS',
    'SASS/SCSS',
    'Vite',
    'Webpack',

    // Backend
    'Node.js',
    'NestJS',
    'Express',
    'Django',
    'Flask',
    'FastAPI',
    'Spring',
    'Spring Boot',
    'Laravel',
    'Ruby on Rails',
    'ASP.NET',
    'Gin',
    'Fiber',

    // Мобильная разработка
    'React Native',
    'Flutter',
    'SwiftUI',
    'Kotlin Multiplatform',
    'Android SDK',
    'iOS SDK',

    // Базы данных
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'SQLite',
    'Redis',
    'Prisma',
    'TypeORM',
    'Sequelize',
    'Supabase',
    'Firebase',

    // DevOps / Инфраструктура
    'Docker',
    'Kubernetes',
    'Git',
    'GitHub Actions',
    'CI/CD',
    'Nginx',
    'AWS',
    'Google Cloud',
    'Vercel',
    'Railway',
    'Linux',

    // ML / Data
    'Machine Learning',
    'TensorFlow',
    'PyTorch',
    'Pandas',
    'NumPy',
    'Data Science',
    'Computer Vision',
    'NLP',

    // Другое
    'GraphQL',
    'REST API',
    'WebSocket',
    'Telegram Bot API',
    'Electron',
    'Unity',
    'Game Dev',
    'Blockchain',
    'Web3',
    'Chrome Extension',
    'Desktop App',
    'CLI Tool',
    'Automation',
    'Bots',
];

async function main() {
    console.log('Начинаю сидинг тегов...');

    for (const name of tags) {
        await prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log('Готово! Добавлено/проверено ${tags.length} тегов.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
