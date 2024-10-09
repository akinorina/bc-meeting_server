import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from './entities/room.entity';
import { RoomAttender } from './entities/room_attender.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOM_REPOSITORY')
    private roomRepository: Repository<Room>,
    @Inject('ROOM_ATTENDER_REPOSITORY')
    private roomAttenderRepository: Repository<RoomAttender>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

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
    return await this.roomRepository.save(roomData);
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
    return this.roomRepository.softDelete(+id);
  }

  // Room 入室API
  async enter(req: any, roomHash: string, peer_id: string) {
    // userId から User を検索
    const targetUser = await this.userRepository.findOneByOrFail({
      id: req.user.id,
    });

    // room_hash から Room　を検索
    const targetRoom = await this.roomRepository.findOneOrFail({
      relations: { room_attenders: true },
      where: { room_hash: roomHash },
    });

    // 当該Roomに User を 出席者として追加
    const roomAttender = new RoomAttender();
    roomAttender.room = targetRoom;
    roomAttender.attender = targetUser;
    roomAttender.peer_id = peer_id;
    await this.roomAttenderRepository.save(roomAttender);

    // Roomの情報：現在の参加者一覧を取得して返す
    const res = await this.roomRepository.findOneOrFail({
      relations: { user: true, room_attenders: { attender: true } },
      where: { room_hash: roomHash },
    });
    // console.debug('res', res.room_attenders);
    const ret = {
      room_id: res.id,
      room_name: res.room_name,
      attenders: null,
    };
    ret.attenders = res.room_attenders.map((item) => {
      return {
        user_id: item.attender.id,
        username: item.attender.username,
        peer_id: item.peer_id,
      };
    });
    // console.log('ret', ret);

    return ret;
  }

  // Room 退室API
  async exit(req: any, roomHash: string, peer_id: string) {
    // userId から User を検索
    const targetUser = await this.userRepository.findOneByOrFail({
      id: req.user.id,
    });
    // console.debug('targetUser', targetUser);

    // room_hash から Room を検索
    const targetRoom = await this.roomRepository.findOneOrFail({
      relations: { user: true, room_attenders: { attender: true } },
      where: { room_hash: roomHash },
    });
    // console.debug('targetRoom', targetRoom);
    // console.debug('---');
    // console.debug('room_attenders', targetRoom.room_attenders);

    // Room から peer_id のユーザーを削除
    const targetAttenderIdx = targetRoom.room_attenders.findIndex((item) => {
      return item.peer_id === peer_id;
    });
    if (targetAttenderIdx < 0) {
      // 該当入室者が無い場合
      throw new HttpException(
        'no such attender:' + peer_id,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Room - 出席者 データの関係を削除
    const targetAttender = targetRoom.room_attenders[targetAttenderIdx];
    // console.debug('---');
    // console.debug('targetAttender', targetAttender);
    // console.debug('>>', targetAttender.attender.id === targetUser.id);
    if (targetAttender.attender.id !== targetUser.id) {
      // 退出者とデータとが不一致 => エラー
      throw new HttpException(
        'differ the user against attender.',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.roomAttenderRepository.softDelete(targetAttender.id);

    // 出席者データ削除
    targetRoom.room_attenders.splice(targetAttenderIdx, 1);
    this.roomRepository.save(targetRoom);

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
