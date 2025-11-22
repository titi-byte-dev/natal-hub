import { IsUUID, IsEmail, IsString, IsOptional } from 'class-validator';

export class SubmitVoteDto {
  @IsUUID()
  contestId: string;

  @IsUUID()
  submissionId: string;

  @IsEmail()
  email: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

