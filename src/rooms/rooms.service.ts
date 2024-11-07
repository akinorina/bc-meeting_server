import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as nunjucks from 'nunjucks';
import { createTransport, Transporter } from 'nodemailer';
import configuration from 'src/config/configuration';
import { SmtpConfig } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from './entities/room.entity';
import { RoomAttender } from './entities/room_attender.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InviteToRoomDto } from './dto/invite-to-room.dto';
import { application } from '../log/logger';

@Injectable()
export class RoomsService {
  smtpConfig: SmtpConfig;
  transporter: Transporter;

  constructor(
    @Inject('ROOM_REPOSITORY')
    private roomRepository: Repository<Room>,
    @Inject('ROOM_ATTENDER_REPOSITORY')
    private roomAttenderRepository: Repository<RoomAttender>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {
    this.smtpConfig = configuration().smtp;
    this.transporter = createTransport(this.smtpConfig);
  }

  async create(req: any, createRoomDto: CreateRoomDto) {
    // User
    const targetUser = await this.userRepository.findOneByOrFail({
      id: req.user.id,
    });

    // hash文字列作成、重複チェック
    let roomHash = '';
    let ret = {};
    do {
      roomHash = this._createRoomHash();
      ret = await this.roomRepository.findOne({
        where: { room_hash: roomHash },
      });
    } while (ret !== null);

    // Room作成
    const roomData = {
      user: targetUser,
      room_hash: roomHash,
      room_name: createRoomDto.room_name,
    };
    const resultRoom = await this.roomRepository.save(roomData);

    // room ログ
    const log_output =
      'room id:' +
      resultRoom.id +
      ' / room name:' +
      resultRoom.room_name +
      ' / room hash:' +
      resultRoom.room_hash +
      ' / user id:' +
      resultRoom.user.id +
      ' / user username:' +
      resultRoom.user.username +
      ' / user name:' +
      resultRoom.user.familyname +
      resultRoom.user.firstname +
      ' / user email:' +
      resultRoom.user.email +
      ' / room createdAt:' +
      resultRoom.createdAt +
      ' / room updatedAt:' +
      resultRoom.updatedAt +
      ' / room deletedAt:' +
      resultRoom.deletedAt;
    application.info('room', 'create a room: ' + log_output);

    return resultRoom;
  }

  async findAll(req: any) {
    const isAll = +req.query.is_all && true;
    const options: any = { relations: { user: true, room_attenders: true } };
    if (req.user && !isAll) {
      options.where = { user: { id: req.user.id } };
    }
    return await this.roomRepository.find(options);
  }

  async findOne(req: any, id: number) {
    try {
      const options: any = {
        relations: { user: true, room_attenders: true },
        where: { id: id },
      };
      if (req.user) {
        options.where.user = { id: req.user.id };
      }
      return await this.roomRepository.findOneOrFail(options);
    } catch (error) {
      throw new HttpException('no such the Room data.', HttpStatus.NOT_FOUND);
    }
  }

  async findOneByRoomHash(req: any, roomHash: string) {
    try {
      const options: any = {
        relations: { user: true, room_attenders: true },
        where: { room_hash: roomHash },
      };
      if (req.user) {
        options.where.user = { id: req.user.id };
      }
      return await this.roomRepository.findOneOrFail(options);
    } catch (error) {
      throw new HttpException('no such the Room data.', HttpStatus.NOT_FOUND);
    }
  }

  async update(req: any, id: number, updateRoomDto: UpdateRoomDto) {
    // Room
    const options: any = {
      relations: { user: true },
      where: { id: id },
    };
    if (req.user) {
      options.where.user = { id: req.user.id };
    }
    const targetRoom = await this.roomRepository.findOneOrFail(options);

    // update the target DB data.
    targetRoom.room_name = updateRoomDto.room_name;
    return this.roomRepository.update(id, targetRoom);
  }

  async remove(id: number) {
    try {
      // Room情報取得
      const options: any = {
        relations: { user: true, room_attenders: true },
        where: { id: id },
      };
      const resultRoom = await this.roomRepository.findOneOrFail(options);

      // Room削除
      const deletedRoom = await this.roomRepository.softDelete(+id);

      // room ログ
      const log_output =
        'room id:' +
        resultRoom.id +
        ' / room name:' +
        resultRoom.room_name +
        ' / room hash:' +
        resultRoom.room_hash +
        ' / user id:' +
        resultRoom.user.id +
        ' / user username:' +
        resultRoom.user.username +
        ' / user name:' +
        resultRoom.user.familyname +
        resultRoom.user.firstname +
        ' / user email:' +
        resultRoom.user.email +
        ' / room createdAt:' +
        resultRoom.createdAt +
        ' / room updatedAt:' +
        resultRoom.updatedAt +
        ' / room deletedAt:' +
        resultRoom.deletedAt;
      application.info('room', 'remove the room: ' + log_output);

      return deletedRoom;
    } catch (error) {
      throw new HttpException('no such the Room data.', HttpStatus.NOT_FOUND);
    }
  }

  // Room への招待メールを送信
  async inviteToRoom(req: any, inviteToRoom: InviteToRoomDto) {
    // ユーザー情報取得
    const targetUser = await this.userRepository.findOneByOrFail({
      id: req.user.id,
    });
    // console.log('targetUser', targetUser);

    // Room情報取得
    const options: any = {
      relations: { user: true },
      where: { id: inviteToRoom.room_id },
    };
    if (req.user) {
      options.where.user = { id: req.user.id };
    }
    const targetRoom = await this.roomRepository.findOneOrFail(options);
    // console.log('targetRoom', targetRoom);

    // メール送信情報
    const mailOption = {
      app_name: configuration().app.name,
      mail_from: configuration().app.system.email_address,
      mail_to: inviteToRoom.invite_email,
      inviting_name: targetUser.familyname + targetUser.firstname,
      invited_email: targetUser.email,
      room_name: targetRoom.room_name,
      room_hash: targetRoom.room_hash,
      room_url: configuration().app.origin + '/room/' + targetRoom.room_hash,
      url_origin: configuration().app.origin,
      date: dayjs().format('YYYY-MM-DD'),
    };
    // console.log('mailOption', mailOption);

    // メール作成
    const toAdminText = nunjucks.render(
      'invitation/invitation_email.to-admin.txt.njk',
      mailOption,
    );
    const toAdminHtml = nunjucks.render(
      'invitation/invitation_email.to-admin.html.njk',
      mailOption,
    );
    // メール送信 to admin.
    await this.transporter.sendMail({
      from: configuration().app.system.email_address,
      to: configuration().app.admin.email_address,
      subject:
        '[' + configuration().app.name + ']: 招待メールが送信されました。',
      text: toAdminText,
      html: toAdminHtml,
    });

    // メール作成
    const toCustomerText = nunjucks.render(
      'invitation/invitation_email.to-user.txt.njk',
      mailOption,
    );
    const toCustomerHtml = nunjucks.render(
      'invitation/invitation_email.to-user.html.njk',
      mailOption,
    );
    // メール送信 to customer.
    await this.transporter.sendMail({
      from: configuration().app.system.email_address,
      to: 'お客様 <' + mailOption.mail_to + '>',
      subject:
        '[' +
        configuration().app.name +
        ']: ' +
        mailOption.inviting_name +
        '様からの招待メールです。',
      text: toCustomerText,
      html: toCustomerHtml,
    });

    const log_output =
      'room name: ' +
      mailOption.room_name +
      ' / room hash: ' +
      mailOption.room_hash +
      ' / room url: ' +
      mailOption.room_url +
      ' / mail to: ' +
      mailOption.mail_to;
    application.info('room', 'sent a inviting e-mail: ' + log_output);

    // 成功レスポンス
    return { status: 'success' };
  }

  // Room 状態取得
  async statusRoom(roomHash: string) {
    // console.log('roomHash', roomHash);

    // Roomの情報：現在の参加者一覧を取得して返す
    const res = await this.roomRepository.findOneOrFail({
      relations: { user: true, room_attenders: true },
      where: { room_hash: roomHash },
    });
    // console.debug('res', res.room_attenders);
    const ret = {
      room_id: res.id,
      room_name: res.room_name,
      room_hash: res.room_hash,
      attenders: null,
    };
    ret.attenders = res.room_attenders.map((item) => {
      return {
        id: item.id,
        peer_id: item.peer_id,
      };
    });
    // console.log('ret', ret);

    return ret;
  }

  // Room 入室API
  async enter(roomHash: string, peer_id: string) {
    if (peer_id === '') {
      throw new HttpException('no peer id.', HttpStatus.BAD_REQUEST);
    }
    // room_hash から Room　を検索
    const targetRoom = await this.roomRepository.findOneOrFail({
      relations: { room_attenders: true },
      where: { room_hash: roomHash },
    });
    // console.log('targetRoom', targetRoom);

    // Room に peer_id が既に登録済みか確認
    const res = await this.roomAttenderRepository.findOne({
      where: { peer_id: peer_id },
    });
    if (res === null) {
      // 当該Roomに peer_id を 出席者として追加
      const roomAttender = new RoomAttender();
      roomAttender.room = targetRoom;
      roomAttender.peer_id = peer_id;
      await this.roomAttenderRepository.save(roomAttender);

      const log_output =
        'room id: ' +
        roomAttender.room.id +
        ' / room name: ' +
        roomAttender.room.room_name +
        ' / room hash: ' +
        roomAttender.room.room_hash;
      application.info('room', 'enter the room: ' + log_output);
    }

    return { status: 'success' };
  }

  // Room 退室API
  async exit(roomHash: string, peer_id: string) {
    // room_hash から Room を検索
    const targetRoom = await this.roomRepository.findOneOrFail({
      relations: { room_attenders: true },
      where: { room_hash: roomHash },
    });

    // 当該Roomに peer_id を 出席者として追加

    // // Room から peer_id のユーザーを削除
    const targetAttenderIdx = targetRoom.room_attenders.findIndex((item) => {
      return item.peer_id === peer_id;
    });
    if (targetAttenderIdx >= 0) {
      // Room - 出席者 データの関係を削除
      const targetAttender = targetRoom.room_attenders[targetAttenderIdx];
      this.roomAttenderRepository.delete(targetAttender.id);

      const log_output =
        'room id: ' +
        targetRoom.id +
        ' / room name: ' +
        targetRoom.room_name +
        ' / room hash: ' +
        targetRoom.room_hash;
      application.info('room', 'exit the room: ' + log_output);

      // // 出席者データ削除
      // targetRoom.room_attenders.splice(targetAttenderIdx, 1);
      // this.roomRepository.save(targetRoom);
    }

    return { status: 'success' };
  }

  // Room Hash 文字列の作成
  _createRoomHash() {
    const stringMap = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const aryHash = [];
    for (let i = 0; i < 12; i++) {
      aryHash.push(stringMap.charAt(Math.floor(Math.random() * 36)));
      if (i === 3 || i === 7) {
        aryHash.push('-');
      }
    }
    return aryHash.join('');
  }
}
