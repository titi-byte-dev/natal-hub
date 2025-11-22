import { IsUUID, IsEmail } from 'class-validator';

export class RequestVerificationCodeDto {
  @IsUUID()
  contestId: string;

  @IsEmail()
  email: string;
}

