import { Observable } from "rxjs";
import { IMailNoti } from "src/interfaces/mail.interface";
import { IUser } from "src/interfaces/user.interface";
import { RegisterDto } from "src/modules/auth/dto/auth.dto";

export interface UserGrpcService {
    create(data: RegisterDto): Observable<any>
    findByEmail(data: { email: string }): Observable<any>
    findById(data: { id: number }): Observable<any>
}

export interface MailGrpcService {
    sendEmail(data: IMailNoti): Observable<any>
}