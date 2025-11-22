# Exemplos de Implementação
## Código de Referência para a Migração

---

## 📁 Estrutura de Projeto

```
contest-saas/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── contests/
│   │   │   ├── submissions/
│   │   │   ├── votes/
│   │   │   ├── organizations/
│   │   │   └── common/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   │
│   ├── web/                    # Frontend Next.js (Público)
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── contest/
│   │   │   │   │   └── [slug]/
│   │   │   │   └── submit/
│   │   │   └── api/
│   │   ├── components/
│   │   └── package.json
│   │
│   └── admin/                  # Admin Dashboard Next.js
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── contests/
│       │   │   ├── submissions/
│       │   │   └── settings/
│       │   └── api/
│       └── package.json
│
├── packages/
│   ├── database/               # Prisma
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   │
│   ├── shared/                 # Código partilhado
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── constants/
│   │   └── package.json
│   │
│   └── ui/                     # Componentes UI
│       ├── src/
│       │   └── components/
│       └── package.json
│
├── docker-compose.yml
├── package.json                # Monorepo root
└── README.md
```

---

## 🗄️ Schema Prisma (Exemplo)

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id              String       @id @default(uuid())
  name            String
  slug            String       @unique
  domain          String?
  logoUrl         String?
  settings        Json         @default("{}")
  subscriptionTier String      @default("free")
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  users           User[]
  contests        Contest[]

  @@index([slug])
}

model User {
  id             String       @id @default(uuid())
  organizationId String
  email          String
  passwordHash   String
  name           String?
  role           String       @default("admin")
  isActive       Boolean      @default(true)
  lastLogin      DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, email])
  @@index([organizationId])
}

model Contest {
  id                  String       @id @default(uuid())
  organizationId      String
  title               String
  slug                String
  description         String?
  startDate           DateTime
  endDate             DateTime
  votingStartDate     DateTime?
  votingEndDate       DateTime?
  maxVotesPerUser     Int          @default(3)
  allowSelfVote       Boolean      @default(false)
  requireEmailVerification Boolean  @default(true)
  status              String       @default("draft")
  settings            Json         @default("{}")
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  organization        Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  categories          Category[]
  submissions         Submission[]
  votes               Vote[]
  verificationCodes   VerificationCode[]

  @@unique([organizationId, slug])
  @@index([organizationId])
  @@index([status])
}

model Category {
  id          String      @id @default(uuid())
  contestId   String
  name        String
  slug        String
  orderIndex  Int         @default(0)
  createdAt   DateTime    @default(now())

  contest     Contest     @relation(fields: [contestId], references: [id], onDelete: Cascade)
  submissions Submission[]

  @@unique([contestId, slug])
  @@index([contestId])
}

model Submission {
  id                String      @id @default(uuid())
  contestId         String
  categoryId        String?
  participantName   String
  participantEmail  String
  imageUrl          String
  imageThumbnailUrl String?
  description       String?
  voteCount         Int         @default(0)
  status            String      @default("pending")
  metadata          Json        @default("{}")
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  contest           Contest     @relation(fields: [contestId], references: [id], onDelete: Cascade)
  category          Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  votes             Vote[]

  @@index([contestId])
  @@index([categoryId])
  @@index([status])
  @@index([voteCount(sort: Desc)])
}

model Vote {
  id            String      @id @default(uuid())
  contestId     String
  submissionId String
  voterEmail    String
  verificationCode String?
  isVerified    Boolean     @default(false)
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime    @default(now())

  contest       Contest     @relation(fields: [contestId], references: [id], onDelete: Cascade)
  submission    Submission  @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  @@unique([contestId, submissionId, voterEmail])
  @@index([contestId, voterEmail])
  @@index([submissionId])
}

model VerificationCode {
  id          String      @id @default(uuid())
  contestId   String
  email       String
  code        String
  expiresAt   DateTime
  usedAt      DateTime?
  createdAt   DateTime    @default(now())

  contest     Contest     @relation(fields: [contestId], references: [id], onDelete: Cascade)

  @@index([email, contestId])
  @@index([expiresAt])
}
```

---

## 🔧 Backend API - NestJS (Exemplo)

### Contest Controller

```typescript
// apps/api/src/contests/contests.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { CreateContestDto, UpdateContestDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.contestsService.findAll(user.organizationId, { page, limit });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.contestsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createContestDto: CreateContestDto,
  ) {
    return this.contestsService.create(user.organizationId, createContestDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    return this.contestsService.update(id, user.organizationId, updateContestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.contestsService.remove(id, user.organizationId);
  }
}
```

### Contest Service

```typescript
// apps/api/src/contests/contests.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContestDto, UpdateContestDto } from './dto';

@Injectable()
export class ContestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [contests, total] = await Promise.all([
      this.prisma.contest.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contest.count({ where: { organizationId } }),
    ]);

    return {
      data: contests,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const contest = await this.prisma.contest.findFirst({
      where: { slug, status: 'active' },
      include: {
        categories: {
          orderBy: { orderIndex: 'asc' },
        },
        organization: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    return contest;
  }

  async create(organizationId: string, createContestDto: CreateContestDto) {
    return this.prisma.contest.create({
      data: {
        ...createContestDto,
        organizationId,
      },
    });
  }

  async update(
    id: string,
    organizationId: string,
    updateContestDto: UpdateContestDto,
  ) {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    if (contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.contest.update({
      where: { id },
      data: updateContestDto,
    });
  }

  async remove(id: string, organizationId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
    });

    if (!contest || contest.organizationId !== organizationId) {
      throw new NotFoundException('Contest not found');
    }

    return this.prisma.contest.delete({
      where: { id },
    });
  }
}
```

### Votes Service (Lógica de Votação)

```typescript
// apps/api/src/votes/votes.service.ts

import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto } from './dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async requestVerificationCode(contestId: string, email: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest || contest.status !== 'active') {
      throw new BadRequestException('Contest not found or not active');
    }

    // Verificar se já existe código válido
    const existingCode = await this.prisma.verificationCode.findFirst({
      where: {
        contestId,
        email,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (existingCode) {
      // Reenviar código existente
      await this.emailService.sendVerificationCode(email, existingCode.code);
      return { message: 'Verification code sent' };
    }

    // Gerar novo código
    const code = this.generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutos

    await this.prisma.verificationCode.create({
      data: {
        contestId,
        email,
        code,
        expiresAt,
      },
    });

    await this.emailService.sendVerificationCode(email, code);

    return { message: 'Verification code sent' };
  }

  async submitVote(contestId: string, createVoteDto: CreateVoteDto) {
    const { submissionId, email, code, ipAddress, userAgent } = createVoteDto;

    // Verificar código
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        contestId,
        email,
        code,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (!verificationCode) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Verificar concurso
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest || contest.status !== 'active') {
      throw new BadRequestException('Contest not found or not active');
    }

    // Verificar submissão
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission || submission.contestId !== contestId) {
      throw new BadRequestException('Submission not found');
    }

    if (submission.status !== 'approved') {
      throw new BadRequestException('Submission not approved');
    }

    // Verificar se já votou nesta submissão
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        contestId_submissionId_voterEmail: {
          contestId,
          submissionId,
          voterEmail: email,
        },
      },
    });

    if (existingVote) {
      throw new BadRequestException('Already voted for this submission');
    }

    // Verificar limite de votos
    const userVotes = await this.prisma.vote.count({
      where: {
        contestId,
        voterEmail: email,
      },
    });

    if (userVotes >= contest.maxVotesPerUser) {
      throw new BadRequestException('Maximum votes reached');
    }

    // Verificar auto-voto
    if (!contest.allowSelfVote && submission.participantEmail === email) {
      throw new ForbiddenException('Cannot vote for your own submission');
    }

    // Criar voto
    await this.prisma.$transaction([
      this.prisma.vote.create({
        data: {
          contestId,
          submissionId,
          voterEmail: email,
          verificationCode: code,
          isVerified: true,
          ipAddress,
          userAgent,
        },
      }),
      this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          voteCount: { increment: 1 },
        },
      }),
      this.prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Vote submitted successfully' };
  }

  private generateCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
}
```

---

## 🎨 Frontend - Next.js (Exemplo)

### Página de Concurso Público

```typescript
// apps/web/app/contest/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { ContestHeader } from '@/components/contest/ContestHeader';
import { SubmissionGrid } from '@/components/contest/SubmissionGrid';
import { getContestBySlug } from '@/lib/api/contests';

export default async function ContestPage({
  params,
}: {
  params: { slug: string };
}) {
  const contest = await getContestBySlug(params.slug);

  if (!contest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <ContestHeader contest={contest} />
      <main className="container mx-auto px-4 py-8">
        <SubmissionGrid contestId={contest.id} />
      </main>
    </div>
  );
}
```

### Componente de Votação

```typescript
// apps/web/components/contest/VoteModal.tsx

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestVerificationCode, submitVote } from '@/lib/api/votes';

interface VoteModalProps {
  submissionId: string;
  contestId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VoteModal({
  submissionId,
  contestId,
  isOpen,
  onClose,
}: VoteModalProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');

  const requestCodeMutation = useMutation({
    mutationFn: () => requestVerificationCode(contestId, email),
    onSuccess: () => setStep('code'),
  });

  const submitVoteMutation = useMutation({
    mutationFn: () => submitVote(contestId, { submissionId, email, code }),
    onSuccess: () => {
      onClose();
      // Mostrar mensagem de sucesso
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Votar</h2>

        {step === 'email' && (
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="seu@email.com"
            />
            <button
              onClick={() => requestCodeMutation.mutate()}
              disabled={requestCodeMutation.isPending}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {requestCodeMutation.isPending ? 'A enviar...' : 'Enviar Código'}
            </button>
          </div>
        )}

        {step === 'code' && (
          <div>
            <p className="mb-4 text-sm text-gray-600">
              Enviámos um código para {email}
            </p>
            <label className="block mb-2">Código de Verificação</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="00000"
              maxLength={5}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep('email')}
                className="flex-1 border py-2 rounded"
              >
                Voltar
              </button>
              <button
                onClick={() => submitVoteMutation.mutate()}
                disabled={submitVoteMutation.isPending}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {submitVoteMutation.isPending ? 'A votar...' : 'Confirmar Voto'}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
```

---

## 🐳 Docker Compose (Exemplo)

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: contest
      POSTGRES_PASSWORD: contest_password
      POSTGRES_DB: contest_saas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://contest:contest_password@postgres:5432/contest_saas
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: eu-west-1
      AWS_S3_BUCKET: contest-uploads
    ports:
      - "3001:3000"
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://api:3000
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

---

## 📦 Package.json (Monorepo)

```json
{
  "name": "contest-saas",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "db:migrate": "cd packages/database && prisma migrate dev",
    "db:generate": "cd packages/database && prisma generate",
    "db:studio": "cd packages/database && prisma studio"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.2.0"
  }
}
```

---

Estes exemplos mostram a estrutura e padrões de código para a migração. A implementação completa seguiria estes padrões em todo o projeto.

