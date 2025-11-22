import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [EmailModule],
  exports: [VotesService],
})
export class VotesModule {}

