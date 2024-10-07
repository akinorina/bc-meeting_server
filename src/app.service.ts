import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return (
      'Application "' +
      String(this.configService.get<string>('APP_NAME')) +
      '" is running.'
    );
  }
}
