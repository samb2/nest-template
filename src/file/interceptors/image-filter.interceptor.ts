import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const file = context.switchToHttp().getRequest().file;
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only images are allowed!');
    }
    if (file.size > 5000000) {
      // 5MB
      throw new BadRequestException('Image size should not exceed 5MB!');
    }
    return next.handle();
  }
}
