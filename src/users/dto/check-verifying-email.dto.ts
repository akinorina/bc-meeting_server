import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CheckVerifyingEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 250)
  email: string;

  @IsNotEmpty()
  hash: string;
}
