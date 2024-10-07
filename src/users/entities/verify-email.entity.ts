/**
 * User data entity
 *
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class VerifyingEmail {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @Column({ default: '', comment: 'メールアドレス' })
  email: string = '';

  @Column({ default: '', comment: 'ハッシュ値' })
  hash: string = '';

  @Column({
    type: 'datetime',
    nullable: true,
    default: null,
    comment: 'email確認済日時',
  })
  verifiedEmailAt: string | undefined = undefined;

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}
