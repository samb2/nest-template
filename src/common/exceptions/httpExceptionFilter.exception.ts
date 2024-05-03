import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import * as process from 'process';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger('HTTP');

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response = context.getResponse<Response>();

    // Determine status code from the exception or default to internal server error
    const statusCode: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the response content from the exception
    const result: string | object = exception.getResponse();

    // Check if the response content is an object
    if (typeof result === 'object') {
      // Prepare response data with additional 'success' field
      const responseData = {
        success: false,
        ...result,
      };

      // Log error details if not in test environment
      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(responseData);
      }

      // Send JSON response with appropriate status code
      response.status(statusCode).json(responseData);
    } else {
      // If response content is a string, treat it as message
      const message: string = exception.message;

      // Log error message if not in test environment
      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(message);
      }

      // Send JSON response with error message and status code
      response.status(statusCode).json({
        success: false,
        statusCode,
        message,
      });
    }
  }
}
