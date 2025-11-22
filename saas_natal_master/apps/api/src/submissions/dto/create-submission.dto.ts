import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  contestId: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsString()
  participantName: string;

  @IsEmail()
  participantEmail: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  imageThumbnailUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

