import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, ParseIntPipe, UsePipes, ValidationPipe, HttpStatus, UseFilters, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/utils/filters/HttpException.filter';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { AuthorizeRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user.roles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @AuthorizeRoles(Roles.USER)
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Get()
  findAll() {
    // return "hello";
    return this.userService.findAll();
  }

  // @UseFilters(HttpExceptionFilter)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(+id);
  
    // console.log("user", user);
    if (!user) {
      return; // Return early if user is not found
    }
  
    return user;
  }

  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      // console.log("findByEmail controller user", user);
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
