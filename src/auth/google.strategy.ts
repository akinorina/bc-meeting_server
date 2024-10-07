import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configuration().auth.google_oauth.client_id,
      clientSecret: configuration().auth.google_oauth.client_secret,
      callbackURL: configuration().auth.google_oauth.redirectUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, name, emails } = profile;
    const user = {
      username: displayName,
      firstname: name.givenName,
      familyname: name.familyName,
      email: emails[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
