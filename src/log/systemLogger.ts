import { HttpException } from '@nestjs/common';
import { system } from './logger';

export default (err: HttpException) => {
  system.error(err.message);
};
