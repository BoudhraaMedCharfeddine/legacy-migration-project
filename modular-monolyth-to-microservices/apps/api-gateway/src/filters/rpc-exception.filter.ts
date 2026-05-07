import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError() as any;
    const res = host.switchToHttp().getResponse<Response>();
    const status = error?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({
      statusCode: status,
      message: error?.message ?? 'Internal server error',
    });
  }
}
