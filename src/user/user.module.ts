import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ValidateUserMiddleware } from './middlewares/validate-user.middleware';
import { ValidateUserAccountMiddleware } from './middlewares/validate-user-account.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],  
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserMiddleware, ValidateUserAccountMiddleware).forRoutes(
      {
        path: "user/email/:email",
        method: RequestMethod.GET,
      },
      {
        path: "user/:id",
        method: RequestMethod.GET,
      }
    )
  }
}
