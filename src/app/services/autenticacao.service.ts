import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AutenticacaoService {

    private token: string | null = null;

    constructor(private http: HttpClient) {}

    login(email: string, senha: string): Observable<{ token: string }> {
        return this.http.post<{ token: string }>('http://localhost:5184/login/auth', { email, senha });
    }

    salvarToken(token: string): void {
        this.token = token;
        localStorage.setItem('token', token);
    }

    retornarToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    estaAutenticado(): boolean {
        return this.retornarToken() !== null;
    }
}