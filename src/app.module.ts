import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/filters/HttpException.filter';
import { dataSourceOptions } from './database/data-source';
import { CurrentUserMiddleware } from './utils/middlewares/current-user.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule, UserModule, PostModule,
  ],
  controllers: [],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: HttpExceptionFilter,
  //   },
  // ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).exclude(
      { path: 'login', method: RequestMethod.ALL },
      { path: 'register', method: RequestMethod.ALL },
    ).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    })
  }
}
