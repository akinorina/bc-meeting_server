import { DataSource } from 'typeorm';
import { RoomAttender } from './room_attender.entity';

export const roomAttenderProviders = [
  {
    provide: 'ROOM_ATTENDER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoomAttender),
    inject: ['DATA_SOURCE'],
  },
];
