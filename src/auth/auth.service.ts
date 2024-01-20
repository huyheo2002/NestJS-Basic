import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import RegisterDto from "./dto/register.dto";
import { hash, compare } from "bcrypt";
import LogInDto from "./dto/login.dto";
import { sign } from "jsonwebtoken";

@Injectable({})
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    generateToken(payload: User): { accessToken: string, refreshToken: string } {
        const accessToken = sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN });
        const refreshToken = sign({ data: payload, refreshToken: true }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN });

        return { accessToken, refreshToken };
    }

    async validateUser(email: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new HttpException("Invalid Token", HttpStatus.UNAUTHORIZED)
        }

        return user;
    }

    async register(userDto: RegisterDto): Promise<User> {
        console.log("userDto.email", userDto.email);
        const userExits = await this.userService.findByEmail(userDto.email);
        console.log("register userExits", userExits)
        userDto.password = await hash(userDto.password, 10);

        if (userExits) {
            throw new HttpException("Email is not avaiable", HttpStatus.UNAUTHORIZED)
        }

        let user = await this.userService.create(userDto);

        return await this.userService.getRepository().save(user);
    }

    async login(userDto: LogInDto): Promise<{ accessToken: string, refreshToken: string }> {
        // const userExits = await this.userService.findByEmail(userDto.email);
        console.log("login services", userDto);
        const userExits = await this.userService.getRepository().createQueryBuilder("user").addSelect("user.password").where("user.email=:email", { email: userDto.email }).getOne();
        if (!userExits) {
            throw new HttpException("Bad credentials", HttpStatus.BAD_REQUEST)
        }

        const matchPassword = await compare(userDto.password, userExits.password);
        if (!matchPassword) {
            throw new HttpException("Bad credentials", HttpStatus.BAD_REQUEST)
        }

        const { accessToken, refreshToken } = this.generateToken(userExits);
        if (userExits && refreshToken) {
            userExits.refreshTokens = userExits.refreshTokens || [];
            userExits.refreshTokens.push(refreshToken);
            await this.userService.update(userExits.id, userExits);
        }

        delete userExits.password;
        // return {userExits, accessToken, refreshToken};
        return { accessToken, refreshToken };

    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const decoded = this.jwtService.verify(refreshToken);

            // Lấy thông tin user từ decoded data
            const user = await this.userService.findByEmail(decoded.data.email);

            if (!user) {
                throw new HttpException("User not found", HttpStatus.NOT_FOUND);
            }

            // Kiểm tra xem refresh token có trong danh sách không
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                throw new HttpException("Invalid Refresh Token", HttpStatus.UNAUTHORIZED);
            }

            // Xóa refresh token khỏi danh sách
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await this.userService.update(user.id, user);

            // Tạo và trả về một cặp mới của access token và refresh token
            const tokens = this.generateToken(user);

            return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        } catch (error) {
            throw new HttpException("Invalid Refresh Token", HttpStatus.UNAUTHORIZED);
        }
    }

    async logout(user: User): Promise<void> {
        // Xóa toàn bộ refresh tokens của user
        user.refreshTokens = [];
        await this.userService.update(user.id, user);
    }
}