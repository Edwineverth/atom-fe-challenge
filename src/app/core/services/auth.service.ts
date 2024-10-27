import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

import { AuthServiceInterface } from "../../shared/interface/auth.interface";
import { User } from "../../shared/models/user.model";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: "root"
})
export class AuthService implements AuthServiceInterface {
    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {}

    public register(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.configService.apiUrl}/api/users`, {
            email,
            password
        });
    }

    public login(email: string, password: string): Observable<{ token: string; user: User }> {
        return this.http
            .post<{ token: string; user: User }>(`${this.configService.apiUrl}/api/login`, {
                email,
                password
            })
            .pipe(
                tap((response) => {
                    if (response && response.token) {
                        localStorage.setItem("token", response.token); // Guarda el token en localStorage
                    }
                })
            );
    }

    public isAuthenticated(): boolean {
        return !!localStorage.getItem("token"); // Verifica si hay un token guardado
    }

    public getToken(): string | null {
        return localStorage.getItem("token");
    }
}
