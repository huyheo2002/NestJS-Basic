import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, ParseIntPipe, UsePipes, ValidationPipe, HttpStatus, UseFilters, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/utils/filters/HttpException.filter';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseFilters(HttpExceptionFilter)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(+id);
  
    console.log("user", user);
    if (!user) {
      return; // Return early if user is not found
    }
  
    return user;
  }

  @Get('/email/:email')
  async getByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.getByEmail(email);

      if(user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }  

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
