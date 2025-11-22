import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            contests: true,
            users: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const updateData: any = { ...updateOrganizationDto };
    if (updateOrganizationDto.settings !== undefined) {
      updateData.settings = typeof updateOrganizationDto.settings === 'string' 
        ? updateOrganizationDto.settings 
        : JSON.stringify(updateOrganizationDto.settings);
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateData,
    });
  }
}

