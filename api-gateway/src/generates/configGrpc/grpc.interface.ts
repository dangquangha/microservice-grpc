import { Observable } from "rxjs";
import { IMailNoti } from "src/interfaces/mail.interface";
import { IUser } from "src/interfaces/user.interface";
import { LoginDto, RegisterDto } from "src/modules/auth/dto/auth.dto";
import { CreatePostDto, UpdatePostDto } from "src/modules/posts/dto/post.dto";

export interface UserGrpcService {
    create(data: RegisterDto): Observable<any>
    findByEmail(data: { email: string }): Observable<any>
    findById(data: { id: number }): Observable<any>
}

export interface MailGrpcService {
    sendEmail(data: IMailNoti): Observable<any>
}

export interface AuthGrpcService {
    login(data: LoginDto): Observable<any>
    register(data: RegisterDto): Observable<any>
    verifyToken(data: { accessToken: string }): Observable<any>
}

export interface PostGrpcService {
    create(data: CreatePostDto): Observable<any>
    findById(data: { id: number }): Observable<any>
    findAll({}): Observable<any>
    update(data: {id: number, data: UpdatePostDto}): Observable<any>
    delete(data: {id: number}): Observable<any>
}