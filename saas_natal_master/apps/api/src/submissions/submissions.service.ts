import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto';
import { calculatePagination } from '@contest-saas/shared';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async findByContest(
    contestId: string,
    options: { page: number; limit: number; categoryId?: string; sort?: string },
  ) {
    const { skip, take } = calculatePagination(options.page, options.limit);

    const where: any = {
      contestId,
      status: 'approved',
    };

    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }

    const orderBy: any = {};
    if (options.sort === 'likes') {
      orderBy.voteCount = 'desc';
    } else if (options.sort === 'nome') {
      orderBy.participantName = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
        },
      }),
      this.prisma.submission.count({ where }),
    ]);

    return {
      data: submissions,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async findAll(organizationId: string, pagination: { page: number; limit: number }) {
    const { skip, take } = calculatePagination(pagination.page, pagination.limit);

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: {
          contest: {
            organizationId,
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          contest: {
            select: {
              title: true,
              slug: true,
            },
          },
          category: true,
        },
      }),
      this.prisma.submission.count({
        where: {
          contest: {
            organizationId,
          },
        },
      }),
    ]);

    return {
      data: submissions,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async findOne(id: string, organizationId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        contest: true,
        category: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    return submission;
  }

  async create(createSubmissionDto: CreateSubmissionDto) {
    return this.prisma.submission.create({
      data: {
        ...createSubmissionDto,
        status: 'pending',
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, organizationId: string, updateSubmissionDto: UpdateSubmissionDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: { contest: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.submission.update({
      where: { id },
      data: updateSubmissionDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, organizationId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: { contest: true },
    });

    if (!submission || submission.contest.organizationId !== organizationId) {
      throw new NotFoundException('Submission not found');
    }

    return this.prisma.submission.delete({
      where: { id },
    });
  }
}

