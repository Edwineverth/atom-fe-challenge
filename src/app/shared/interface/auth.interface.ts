import { Observable } from "rxjs";

import { User } from "../models/user.model";

export interface AuthServiceInterface {
    login(email: string, password: string): Observable<{ token: string; user: User }>;
    register(email: string, password: string): Observable<User>;
    isAuthenticated(): boolean;
    getToken(): string | null;
}
