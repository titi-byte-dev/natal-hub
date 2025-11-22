import { IsString, IsDateString, IsOptional, IsInt, IsBoolean, IsObject } from 'class-validator';

export class CreateContestDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsDateString()
  votingStartDate?: string;

  @IsOptional()
  @IsDateString()
  votingEndDate?: string;

  @IsOptional()
  @IsInt()
  maxVotesPerUser?: number;

  @IsOptional()
  @IsBoolean()
  allowSelfVote?: boolean;

  @IsOptional()
  @IsBoolean()
  requireEmailVerification?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

