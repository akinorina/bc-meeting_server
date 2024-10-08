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
