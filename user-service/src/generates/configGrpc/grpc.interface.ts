import { Observable } from "rxjs";
import { IUser } from "src/interfaces/user.interface";

export interface AuthGrpcService {
    verifyToken(accessToken: { accessToken: String }): Observable<any>
}