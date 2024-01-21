import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { isArray } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly userServices: UserService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        // console.log("req", req);
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || isArray(authHeader) || !authHeader.startsWith("Bearer ")) {
            req.currentUser = null;
            next();
            return;
        } else {
            const token = authHeader.split(" ")[1];
            console.log("token", token);
            try {
                const payload = verify(token, process.env.JWT_SECRET);
                console.log("payload middleware", payload);

                if (payload && payload) {
                    const getIdUser = payload.sub;
                    console.log("getIdUser", getIdUser)
                    const currentUser = await this.userServices.findOne(+getIdUser);
                    req.currentUser = currentUser;
                    console.log("currentUser", currentUser);
                }
                next();
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    throw new UnauthorizedException("TokenExpired!");
                }

                throw error;
            }
        }
    }
}

// interface JwtPayload {
//     sub: number;
//     name: string;
//     role: string[];
//     iat: number;
//     exp: number;
// }