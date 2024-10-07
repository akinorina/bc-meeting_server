import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { console, application } from '../log/logger';

@Controller('sample_logs')
export class SampleLogsController {
  @Get()
  app() {
    console.debug('GET /api/sample_logs on console.');
    application.debug('logs', 'ログ出力');
    application.debug('logs1', 'ログ1出力');
    return 'applicationLog - ログ出力';
  }

  @Get('fatal')
  fatal() {
    console.fatal('GET /api/sample_logs/fatal on console.');
    application.fatal('logs', 'fatal ログ出力');
    application.fatal('logs1', 'fatal ログ1出力');
    return 'applicationLog - fatal ログ出力';
  }

  @Get('error')
  error() {
    console.error('GET /api/sample_logs/error on console.');
    application.error('logs', 'error ログ出力');
    application.error('logs1', 'error ログ1出力');
    application.error('logs2', 'error ログ2出力');
    return 'applicationLog - error ログ出力';
  }

  @Get('warn')
  warn() {
    console.warn('GET /api/sample_logs/warn on console.');
    application.warn('logs', 'warn ログ出力');
    application.warn('logs2', 'warn ログ2出力');
    return 'applicationLog - warn ログ出力';
  }

  @Get('info')
  info() {
    console.info('GET /api/sample_logs/info on console.');
    application.info('logs', 'info ログ出力');
    application.info('logs2', 'info ログ2出力');
    return 'applicationLog - info ログ出力';
  }

  @Get('debug')
  debug() {
    console.debug('GET /api/sample_logs/debug on console.');
    application.debug('logs', 'debug ログ出力');
    application.debug('logs2', 'debug ログ2出力');
    return 'applicationLog - debug ログ出力';
  }

  @Get('trace')
  trace() {
    console.trace('GET /api/sample_logs/trace on console.');
    application.trace('logs', 'trace ログ出力');
    application.trace('logs2', 'trace ログ2出力');
    return 'applicationLog - trace ログ出力';
  }

  @Get('err')
  err() {
    throw new HttpException('私のエラー', HttpStatus.NOT_FOUND);
  }
}
