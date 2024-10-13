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
import { RoomAttender } from './room_attender.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @ManyToOne(() => User, (user) => user.rooms)
  user: User;

  @Column({ default: '', comment: 'Room 名' })
  room_name: string = '';

  @Column({ default: '', comment: 'Room hash', unique: true })
  room_hash: string = '';

  @OneToMany(() => RoomAttender, (room_attender) => room_attender.room)
  room_attenders: RoomAttender[];

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}
