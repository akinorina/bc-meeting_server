/**
 * Room data entity
 *
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomAttender } from './room_attender.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @Column({ default: '', comment: 'hash', unique: true })
  room_hash: string = '';

  @Column({ default: '', comment: 'ROOM名' })
  room_name: string = '';

  @ManyToOne(() => User, (user) => user.rooms)
  user: User;

  @OneToMany(() => RoomAttender, (room_attender) => room_attender.room)
  room_attenders: RoomAttender[];

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;

  setValueByCreateRoomDto(createRoomDto: CreateRoomDto) {
    this.room_name = createRoomDto.room_name;
  }
}
