import { ClientOptions } from "@grpc/grpc-js";
import { Transport } from "@nestjs/microservices";
import { join } from "path";
import '@grpc/proto-loader'
export const grpcUserClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:5001',
        package: 'user',
        protoPath: join(__dirname, '../../../../proto/user.proto'),
        loader: {
            keepCase: true
        }
    },
}
export const grpcMailClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:5000',
        package: 'email',
        protoPath: join(__dirname, '../../../../proto/email.proto'),
        loader: {
            keepCase: true
        }
    },
}
export const grpcAuthClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:5002',
        package: 'auth',
        protoPath: join(__dirname, '../../../../proto/auth.proto'),
        loader: {
            keepCase: true
        }
    },
}