import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable({})
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    generateToken(payload: User): string {
        // const accessToken = this.jwtService.sign({ email });
        console.log("payload", payload);
        const token = this.jwtService.sign({ data: payload }); // Đây là ví dụ, thay đổi phần "data" thành trường phù hợp với ứng dụng của bạn.
        console.log("token", token);
        return token;
    }

    async validateUser(email: string) {
        const user = await this.userService.getByEmail(email);

        if (!user) {
            throw new HttpException("Invalid Token", HttpStatus.UNAUTHORIZED)
        }

        return user;
    }

    async register(userDto: CreateUserDto) {
        const user = await this.userService.create(userDto);

        const token = this.generateToken(user);
        return {
            email: user.email,
            // token,
        }
    }

    async login(username: string, password: string) {
        const user = await this.userService.getByEmail(username);

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        } else {
            if (user.password == password) {
                const token = this.generateToken(user);

                return {
                    email: user.email,
                    // token,
                }
            }
        }
    }
}