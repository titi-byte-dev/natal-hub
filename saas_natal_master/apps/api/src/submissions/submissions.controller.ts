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
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('contest/:contestId')
  async findByContest(
    @Param('contestId') contestId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('sort') sort?: string,
  ) {
    return this.submissionsService.findByContest(contestId, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 18,
      categoryId,
      sort: sort || 'date',
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.submissionsService.findAll(req.user.organizationId, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    return this.submissionsService.findOne(id, req.user.organizationId);
  }

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.create(createSubmissionDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.update(id, req.user.organizationId, updateSubmissionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    return this.submissionsService.remove(id, req.user.organizationId);
  }
}

