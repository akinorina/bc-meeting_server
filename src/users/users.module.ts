import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './entities/user.providers';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { roleProviders } from '../roles/entities/role.providers';
import { verifyingEmailProviders } from './entities/verify-email.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...userProviders,
    UsersService,
    ...roleProviders,
    ...verifyingEmailProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}
