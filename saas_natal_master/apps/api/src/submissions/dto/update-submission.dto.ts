import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmissionDto } from './create-submission.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {
  @IsOptional()
  @IsString()
  status?: string;
}

