import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('BLOG_REPOSITORY')
    private blogRepository: Repository<Blog>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(req: any, createBlogDto: CreateBlogDto) {
    // User
    const targetUser = await this.userRepository.findOneByOrFail({
      id: req.user.id,
    });

    const blogData = {
      subject: createBlogDto.subject,
      body: createBlogDto.body,
      user: targetUser,
    };
    return this.blogRepository.save(blogData);
  }

  async findAll(req: any) {
    const options: any = { relations: { user: true } };
    if (req.user) {
      options.where = { user: { id: req.user.id } };
    }
    return await this.blogRepository.find(options);
  }

  async findOne(req: any, id: number) {
    try {
      const options: any = {
        relations: { user: true },
        where: { id: id },
      };
      if (req.user) {
        options.where.user = { id: req.user.id };
      }
      return await this.blogRepository.findOneOrFail(options);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(req: any, id: number, updateBlogDto: UpdateBlogDto) {
    try {
      // User
      const targetUser = await this.userRepository.findOneByOrFail({
        id: req.user.id,
      });

      // update the target DB data.
      const updateData = {
        id: id,
        subject: updateBlogDto.subject,
        body: updateBlogDto.body,
        user: targetUser,
      };
      return await this.blogRepository.update(id, updateData);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return this.blogRepository.softDelete(id);
  }
}
