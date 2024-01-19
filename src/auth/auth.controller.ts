import { Controller, Post, Request, UseGuards, Body, Get, HttpException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "@nestjs/passport";
import RegisterDto from "./dto/register.dto";
import { User } from "src/user/entities/user.entity";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Get()
    // @UseGuards(AuthGuard("local"))
    // getHello(@Request() req): string {
    //     // console.log("req", req);
    //     // return this.authService.generateToken(req.user);
    // }

    @Get("/test-jwt")
    @UseGuards(AuthGuard("jwt"))
    testJwt(): string {
        return "this is jwt"
    }

    // @Post("/local/signup")
    // signupLocal() {
    //     return this.authService.signupLocal();
    // }

    @Post("/login")
    @UseGuards(AuthGuard("local"))
    async login(@Request() req): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            // username = email
            const { accessToken, refreshToken } = await this.authService.login(req.user.username, req.user.password);

            return { accessToken, refreshToken };
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post("/refresh")
    async refreshToken(@Body() { refreshToken }: { refreshToken: string }): Promise<{ accessToken: string, refreshToken: string }> {
        const tokens = await this.authService.refreshToken(refreshToken);
        return tokens;
    }

    @Post("/register")
    async register(@Body() body: RegisterDto): Promise<{ user: User }> {
        return { user: await this.authService.register(body) }
    }

    @Post("/logout")
    @UseGuards(AuthGuard("jwt"))
    async logout(@Request() req): Promise<{ message: string }> {
        const user = await this.authService.validateUser(req.user.email);
        await this.authService.logout(user);
        return { message: "Logout successful" };
    }
}