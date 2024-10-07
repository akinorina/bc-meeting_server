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
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Image } from '../../images/entities/image.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { VerifyingEmail } from './verify-email.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @Column({ default: '', comment: 'ユーザー名' })
  username: string = '';

  @Column({ default: '', comment: '姓' })
  familyname: string = '';

  @Column({ default: '', comment: '名' })
  firstname: string = '';

  @Column({ default: '', comment: '姓かな' })
  familynameKana: string = '';

  @Column({ default: '', comment: '名かな' })
  firstnameKana: string = '';

  @Column({ default: '', comment: 'メールアドレス', unique: true })
  email: string = '';

  @Column({ default: '', comment: 'パスワード' })
  password: string = '';

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @OneToOne(() => VerifyingEmail)
  @JoinColumn()
  verifying_email: VerifyingEmail;

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;

  setValueByCreateUserDto(createUserDto: CreateUserDto) {
    this.username = createUserDto.username;
    this.firstname = createUserDto.firstname;
    this.familyname = createUserDto.familyname;
    this.firstnameKana = createUserDto.firstnameKana;
    this.familynameKana = createUserDto.familynameKana;
    this.email = createUserDto.email;
    this.password = createUserDto.password;
  }
}
