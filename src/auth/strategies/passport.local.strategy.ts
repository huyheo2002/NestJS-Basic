import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class PassportlocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        // USERNAME = EMAIL
        const user : User = await this.userService.getByEmail(username);
        
        if (!user) {
            throw new UnauthorizedException();
        }

        if(user.password == password) return user;
    }
}