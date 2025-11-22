import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar organização de exemplo
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo',
      subscriptionTier: 'pro',
      settings: JSON.stringify({
        theme: {
          primaryColor: '#10b981',
          secondaryColor: '#ef4444',
        },
      }),
    },
  });

  console.log('✅ Created organization:', organization.name);

  // Criar utilizador admin
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: organization.id,
        email: 'admin@demo.com',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      email: 'admin@demo.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Criar concurso de exemplo
  const contest = await prisma.contest.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: 'natal-2024',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      title: 'Concurso de Natal 2024',
      slug: 'natal-2024',
      description: 'Concurso de árvores de Natal',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      votingStartDate: new Date('2024-12-15'),
      votingEndDate: new Date('2024-12-30'),
      maxVotesPerUser: 3,
      status: 'active',
      settings: JSON.stringify({}),
    },
  });

  console.log('✅ Created contest:', contest.title);

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: {
        contestId_slug: {
          contestId: contest.id,
          slug: 'equipa-1',
        },
      },
      update: {},
      create: {
        contestId: contest.id,
        name: 'Equipa 1',
        slug: 'equipa-1',
        orderIndex: 0,
      },
    }),
    prisma.category.upsert({
      where: {
        contestId_slug: {
          contestId: contest.id,
          slug: 'equipa-2',
        },
      },
      update: {},
      create: {
        contestId: contest.id,
        name: 'Equipa 2',
        slug: 'equipa-2',
        orderIndex: 1,
      },
    }),
  ]);

  console.log('✅ Created categories:', categories.length);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

