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
} from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class RoomAttender {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @ManyToOne(() => Room, (room) => room.room_attenders)
  room: Room;

  @ManyToOne(() => User, (user) => user.room_attenders)
  attender: User;

  @Column({ default: '', comment: 'hash' })
  peer_id: string = '';

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}