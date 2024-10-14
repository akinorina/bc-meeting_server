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
    return this.roomRepository.softDelete(+id);
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
