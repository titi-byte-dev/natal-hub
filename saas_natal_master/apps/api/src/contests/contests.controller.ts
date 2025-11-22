import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContestsService } from './contests.service';
import { CreateContestDto, UpdateContestDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.contestsService.findAll(req.user.organizationId, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
  }

  @Get('public/:slug')
  async findOne(@Param('slug') slug: string) {
    return this.contestsService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneById(@Param('id') id: string, @Request() req) {
    return this.contestsService.findOne(id, req.user.organizationId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createContestDto: CreateContestDto) {
    return this.contestsService.create(req.user.organizationId, createContestDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    return this.contestsService.update(id, req.user.organizationId, updateContestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    return this.contestsService.remove(id, req.user.organizationId);
  }
}

