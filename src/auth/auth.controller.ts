import { Controller, Post, Request, UseGuards, Body, Get, HttpException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "@nestjs/passport";
import RegisterDto from "./dto/register.dto";
import { User } from "src/user/entities/user.entity";
import LogInDto from "./dto/login.dto";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthenticationGuard } from "src/utils/guards/authentication.guard";

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

    @Post("/login")
    async login(@Body() userLogInDto: LogInDto): Promise<{ accessToken: string, refreshToken: string }> {
        const { accessToken, refreshToken } = await this.authService.login(userLogInDto);        

        return { accessToken, refreshToken };
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

    @UseGuards(AuthenticationGuard)
    @Get("/check-user")
    getCurrentUser(@CurrentUser() currentUser: User) {
        return currentUser;
    }
}