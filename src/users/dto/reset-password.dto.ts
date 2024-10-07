import { IsNotEmpty, IsAlphanumeric, Length, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 200)
  email: string;

  @IsNotEmpty()
  @Length(1, 80)
  hash: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(1, 200)
  password: string;
}
