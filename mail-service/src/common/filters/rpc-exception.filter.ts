import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RPCExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return of({
      success: false,
      message: exception.getError()
    })
  }
}