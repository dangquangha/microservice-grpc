import { Observable } from "rxjs";
import { IPost } from "src/interfaces/post.interface";

import { IUser } from "src/interfaces/user.interface";

export interface PostGrpcService {
    create(data: IPost): Observable<any>
    findById(data: { id: number }): Observable<any>
    findAll(): Observable<any>
}

export interface AuthGrpcService {
    verifyToken(accessToken: { accessToken: String }): Observable<any>
}

export interface UserGrpcService {
    findById(data: { id: number }): Observable<any>
}
