import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { VotesService } from './votes.service';
import { RequestVerificationCodeDto, SubmitVoteDto } from './dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('request-verification')
  async requestVerificationCode(@Body() dto: RequestVerificationCodeDto) {
    return this.votesService.requestVerificationCode(dto.contestId, dto.email);
  }

  @Post('submit')
  async submitVote(@Body() dto: SubmitVoteDto) {
    return this.votesService.submitVote(dto);
  }
}

