import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class GoogleAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInGoogle(req: any) {
    // return 'no_user_from_google';
    if (!req.user) {
      return 'no_user_from_google';
    }

    // search the user on DB.
    let targetUser = await this.usersService.findOneByEmail(req.user.email);
    if (!targetUser) {
      const targetUserDeleted = await this.usersService.findOneByEmail(
        req.user.email,
        true,
      );
      if (targetUserDeleted) {
        throw new HttpException(
          'このアカウントでの登録はできません' + ' : ' + req.user.email,
          HttpStatus.BAD_REQUEST,
        );
      }

      // create new user from google-auth data.
      const newUserDto = new CreateUserDto();
      newUserDto.username = req.user.username;
      newUserDto.familyname = req.user.familyname;
      newUserDto.firstname = req.user.firstname;
      newUserDto.email = req.user.email;
      newUserDto.password = '';
      targetUser = await this.usersService.create(newUserDto);
    }

    // create and return the access token.
    const roles = targetUser.roles.map((item) => {
      return item.name;
    });
    const payload = {
      username: targetUser.username,
      sub: targetUser.id,
      roles: roles,
    };
    return this.jwtService.sign(payload);
  }
}
