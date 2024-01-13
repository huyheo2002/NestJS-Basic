import { Injectable, NestMiddleware, HttpStatus, HttpException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class ValidateUserAccountMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("this is ValidateUserAccountMiddleware");
        const { valid } = req.headers;
        console.log("valid in ValidateUserAccountMiddleware", valid)
        if (valid) {
            next();
        } else {
            return res.status(401).send({ error: "Account is invalid" });
        }        
    }
}