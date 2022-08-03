import { ClientOptions } from "@grpc/grpc-js";
import { Transport } from "@nestjs/microservices";
import { join } from "path";
import '@grpc/proto-loader'
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
