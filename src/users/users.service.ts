import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { USER_REPOSITORY, USERS_ROLES } from './constants';
import { User } from './entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        ...createUserDto,
      },
    });

    console.log(user);
    if (user) {
      throw new ConflictException('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    try {
      return await this.userRepository.create({
        ...createUserDto,
      });
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return user;
  }

  fetchUsersRoles() {
    return USERS_ROLES;
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
