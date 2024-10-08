import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ERoles } from 'src/enumerates/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles([ERoles.User])
  @Post()
  create(@Request() req: any, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(req, createRoomDto);
  }

  @Roles([ERoles.User])
  @Get()
  findAll(@Request() req: any) {
    return this.roomsService.findAll(req);
  }

  @Roles([ERoles.User])
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.roomsService.findOne(req, +id);
  }

  @Roles([ERoles.User])
  @Put(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(req, +id, updateRoomDto);
  }

  @Roles([ERoles.User])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
