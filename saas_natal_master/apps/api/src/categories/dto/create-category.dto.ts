import { IsString, IsUUID, IsInt, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  contestId: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

