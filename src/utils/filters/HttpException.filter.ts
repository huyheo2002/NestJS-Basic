import { ArgumentsHost, ExceptionFilter, HttpException, Catch } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log("exception.getResponse()", exception.getResponse());
        console.log("exception.getStatus()", exception.getStatus());
        console.log("exception", exception);

        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        if (!response.headersSent) {
            response.status(exception.getStatus()).json({
                status: exception.getStatus(),
                message: exception.getResponse(),
            });
        } else {
            console.log('Headers have already been sent.');
        }
    }
}
