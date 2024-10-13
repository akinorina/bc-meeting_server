import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { userProviders } from 'src/users/entities/user.providers';
import { roomProviders } from './entities/room.providers';
import { roomAttenderProviders } from './entities/room_attender.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    ...roomProviders,
    ...roomAttenderProviders,
    ...userProviders,
  ],
})
export class RoomsModule {}
