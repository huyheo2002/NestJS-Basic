import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportlocalStrategy } from "./strategies/passport.local.strategy";
import { UserService } from "src/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([User]), PassportModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: process.env.EXPIRESIN
        }        
    })],
    controllers: [AuthController],
    providers: [AuthService, PassportlocalStrategy, UserService, JwtStrategy],
    exports: [AuthService]
})

export class AuthModule {
    constructor() {
        console.log("JWT_SECRET:", process.env.JWT_SECRET || "defaultSecret");
    }
}