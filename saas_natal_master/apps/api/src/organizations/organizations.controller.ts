import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req) {
    return this.organizationsService.findOne(req.user.organizationId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(req.user.organizationId, updateOrganizationDto);
  }
}

