import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ERoles } from 'src/enumerates/roles.enum';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Roles([ERoles.User])
  @Post()
  create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(req, createBlogDto);
  }

  @Roles([ERoles.User])
  @Get()
  findAll(@Request() req) {
    return this.blogsService.findAll(req);
  }

  @Roles([ERoles.User])
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.blogsService.findOne(req, +id);
  }

  @Roles([ERoles.User])
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(req, +id, updateBlogDto);
  }

  @Roles([ERoles.User])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}
