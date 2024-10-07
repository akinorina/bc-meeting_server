import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { imageProviders } from './entities/image.providers';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { userProviders } from 'src/users/entities/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ImagesController],
  providers: [...imageProviders, ImagesService, ...userProviders],
})
export class ImagesModule {}
