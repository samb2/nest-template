import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import {firstValueFrom, Observable, of} from 'rxjs';
import {Reflector} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import * as process from 'process';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    public statusMessages: { [key: string]: string };

    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {
        this.statusMessages = {
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'NonAuthoritativeInfo',
            204: 'NoContent',
            205: 'ResetContent',
            206: 'PartialContent',
        };
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const env: string | undefined = process.env.NODE_ENV;
        const body = await firstValueFrom(next.handle());
        const status: number =
            this.reflector.get<number>('__httpCode__', context.getHandler()) || 200;

        const responseObj: any = {
            from: this.configService.get<string>('server.service_name'),
            success: true,
            statusCode: status,
            message: this.statusMessages[status],
            data: body,
            path: request.url,
            method: request.method,
        };
        // Conditionally add time for development environment
        if (env === 'development') {
            responseObj.responseTime = `${Date.now() - now}ms`;
        }

        return of(responseObj);
    }
}
