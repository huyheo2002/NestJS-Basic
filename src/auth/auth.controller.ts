import { Controller, Post, Request, UseGuards, Body, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    @UseGuards(AuthGuard("local"))
    getHello(@Request() req): string {
        // console.log("req", req);
        return this.authService.generateToken(req.user);
    }

    @Get("/test-jwt")
    @UseGuards(AuthGuard("jwt"))
    testJwt() : string {
        return "this is jwt"
    }

    // @Post("/local/signup")
    // signupLocal() {
    //     return this.authService.signupLocal();
    // }

    @Post("/login")
    @UseGuards(AuthGuard("local"))
    Login(@Request() req): string {
        // authentication complete :V
        // return this.authService.login();

        // authorization
        return this.authService.generateToken(req.user);
    }

    // @Post("/logout")
    // logout() {
    //     return this.authService.logout();
    // }

    // @Post("/refresh")
    // refreshToken() {
    //     return this.authService.refreshToken();
    // }
}