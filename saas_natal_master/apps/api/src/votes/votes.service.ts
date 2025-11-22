import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitVoteDto } from './dto';
import { EmailService } from '../email/email.service';
import { generateVerificationCode } from '@contest-saas/shared';

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
    const code = generateVerificationCode();
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

  async submitVote(dto: SubmitVoteDto) {
    const { contestId, submissionId, email, code, ipAddress, userAgent } = dto;

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
      throw new NotFoundException('Submission not found');
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
}

