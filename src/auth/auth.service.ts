import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import RegisterDto from "./dto/register.dto";
import { hash } from "bcrypt";

@Injectable({})
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    generateToken(payload: User): { accessToken: string, refreshToken: string } {
        // const accessToken = this.jwtService.sign({ email });
        // console.log("payload", payload);
        // const token = this.jwtService.sign({ data: payload });
        // console.log("token", token);
        // return token;

        const accessToken = this.jwtService.sign({ data: payload });
        const refreshToken = this.jwtService.sign({ data: payload, refreshToken: true }, { expiresIn: process.env.EXPIRESIN });

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

        if(userExits) {
            throw new HttpException("Email is not avaiable", HttpStatus.UNAUTHORIZED)
        }
        
        let user = await this.userService.create(userDto);        
        
        return await this.userService.getRepository().save(user);
    }

    async login(username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.userService.findByEmail(username);

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        } else {
            if (user.password === password) {
                const { accessToken, refreshToken } = this.generateToken(user);    
                
                user.refreshTokens = user.refreshTokens || [];
                user.refreshTokens.push(refreshToken);
                await this.userService.update(user.id, user);

                return { accessToken, refreshToken };
            }
        }

        throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
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