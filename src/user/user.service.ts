import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    } else {
      // Bạn có thể quyết định xử lý ngoại lệ ở đây nếu muốn
      // throw new UserNotFoundException('User not found', HttpStatus.NOT_FOUND);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User> {
    // const user = await this.usersRepository.findOne({ where: { email } });
    const user = await this.usersRepository.findOneBy({ email });
    // console.log("user findByEmail services", user);
    if (user) {
      return user;
    }
    // throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    return await this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    let user: User = new User();
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    user.id = id;

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  getRepository(): Repository<User> {
    return this.usersRepository;
  }
}
