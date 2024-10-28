import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyingEmailDto } from './dto/verifying-email.dto';
import { CheckVerifyingEmailDto } from './dto/check-verifying-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ERoles } from 'src/enumerates/roles.enum';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles([ERoles.Admin])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles([ERoles.Admin])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles([ERoles.Admin, ERoles.User])
  @Put('change-password')
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user, changePasswordDto);
  }

  @Roles([ERoles.Admin])
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles([ERoles.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Public()
  @Post('verifing-email')
  verifyingEmail(@Body() verifyingEmailDto: VerifyingEmailDto) {
    return this.usersService.verifyingEmail(verifyingEmailDto);
  }

  @Public()
  @Post('check_verifying_email')
  checkVerifyingEmail(@Body() checkVerifyingEmailDto: CheckVerifyingEmailDto) {
    return this.usersService.checkVerifyingEmail(checkVerifyingEmailDto);
  }

  @Public()
  @Post('register-user')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('send_test_mail')
  sendTestMail() {
    return this.usersService.sendTestMail();
  }
}
