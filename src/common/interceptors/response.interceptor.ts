import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

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
    const env: string | undefined = this.configService.get('server.node_env');

    // Get the response body from the next call handler
    const body = await firstValueFrom(next.handle());

    // Get the HTTP status code from metadata or default to 200
    const status: number =
      this.reflector.get<number>('__httpCode__', context.getHandler()) || 200;

    // Construct the response object with standard structure
    const responseObj: any = {
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

    // Return the modified response as an observable
    return of(responseObj);
  }
}
