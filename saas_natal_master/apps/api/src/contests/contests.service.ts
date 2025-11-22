import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContestDto, UpdateContestDto } from './dto';
import { calculatePagination } from '@contest-saas/shared';

@Injectable()
export class ContestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, pagination: { page: number; limit: number }) {
    const { skip, take } = calculatePagination(pagination.page, pagination.limit);

    const [contests, total] = await Promise.all([
      this.prisma.contest.findMany({
        where: { organizationId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: true,
          _count: {
            select: {
              submissions: true,
              votes: true,
            },
          },
        },
      }),
      this.prisma.contest.count({ where: { organizationId } }),
    ]);

    return {
      data: contests,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
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
            settings: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    return contest;
  }

  async findOne(id: string, organizationId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: {
        categories: true,
        _count: {
          select: {
            submissions: true,
            votes: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    if (contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    return contest;
  }

  async create(organizationId: string, createContestDto: CreateContestDto) {
    return this.prisma.contest.create({
      data: {
        ...createContestDto,
        organizationId,
        settings: createContestDto.settings ? JSON.stringify(createContestDto.settings) : '{}',
      },
      include: {
        categories: true,
      },
    });
  }

  async update(id: string, organizationId: string, updateContestDto: UpdateContestDto) {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    if (contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    const updateData: any = { ...updateContestDto };
    if ((updateContestDto as any).settings !== undefined) {
      updateData.settings = typeof (updateContestDto as any).settings === 'string' 
        ? (updateContestDto as any).settings 
        : JSON.stringify((updateContestDto as any).settings);
    }

    return this.prisma.contest.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
      },
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

