import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

const statusMessages = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'NonAuthoritativeInfo',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',
};

class SuccessResponseDto<T> {
  success: boolean;
  statusCode: string;
  message: string;
  data: T;
  path: string;
  method: string;
}

export const ApiOkResponseSuccess = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  status: number = 200,
  isArray: boolean = false,
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              success: {
                type: 'true',
                default: 'true',
              },
              statusCode: {
                type: 'number',
                default: status,
              },
              message: {
                type: 'number',
                default: statusMessages[status],
              },
              data: isArray
                ? {
                    items: { $ref: getSchemaPath(dataDto) },
                  }
                : {
                    $ref: getSchemaPath(dataDto),
                  },
              path: {
                type: 'string',
                default: 'api/',
              },
              method: {
                type: 'string',
                default: 'GET/POST/PATCH/DELETE',
              },
            },
          },
        ],
      },
    }),
  );
