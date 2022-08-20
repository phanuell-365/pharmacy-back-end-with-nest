import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { USER_REPOSITORY } from './constants';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    return this.userRepository.create({
      ...createUserDto,
    });
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    return await this.userRepository.findByPk(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return await user.update({ ...updateUserDto });
  }

  async remove(id: string) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return await user.destroy();
  }
}
