import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findByContest(contestId: string) {
    return this.prisma.category.findMany({
      where: { contestId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async create(organizationId: string, createCategoryDto: CreateCategoryDto) {
    // Verificar se o concurso pertence à organização
    const contest = await this.prisma.contest.findUnique({
      where: { id: createCategoryDto.contestId },
    });

    if (!contest || contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: string, organizationId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { contest: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.contest.organizationId !== organizationId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string, organizationId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { contest: true },
    });

    if (!category || category.contest.organizationId !== organizationId) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}

