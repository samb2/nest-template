import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import {Response} from 'express';
import {HttpArgumentsHost} from '@nestjs/common/interfaces';
import {ConfigService} from '@nestjs/config';
import * as process from 'process';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger('HTTP');

    constructor(private readonly configService: ConfigService) {
    }

    async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
        const context: HttpArgumentsHost = host.switchToHttp();
        const response = context.getResponse<Response>();
        const serverName: string | undefined = this.configService.get<string>(
            'server.service_name',
        );
        const statusCode: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        const result = exception.getResponse();
        if (typeof result === 'object') {
            const responseData = {
                from: serverName,
                success: false,
                ...result,
            };

            if (process.env.NODE_ENV !== 'test') {
                this.logger.error(responseData);
            }
            response.status(statusCode).json(responseData);
        } else {
            const message = exception.message;
            if (process.env.NODE_ENV !== 'test') {
                this.logger.error(message);
            }
            response.status(statusCode).json({
                from: serverName,
                success: false,
                statusCode,
                message,
            });
        }
    }
}
