import { IsNotEmpty, IsAlphanumeric, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(1, 200)
  oldPassword: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(1, 200)
  newPassword: string;
}
