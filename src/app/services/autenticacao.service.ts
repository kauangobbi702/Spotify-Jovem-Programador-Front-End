import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AutenticacaoService {

    private token: string | null = null;
    private estaLogado: boolean = false;

    constructor(private http: HttpClient) {}

    login(nome: string): Observable<string> {
        return this.http.post('http://localhost:5184/api/login/auth', { nome }, { responseType: 'text'});
    }

    salvarToken(token: string): void {
        this.token = token;
        localStorage.setItem('token', token);
        this.estaLogado = true;
    }

    retornarToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    estaAutenticado(): boolean {
        return this.estaLogado;
    }
}