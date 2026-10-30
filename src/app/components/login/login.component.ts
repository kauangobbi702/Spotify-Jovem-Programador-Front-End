import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router,
  ) {}

  autenticar(): void {
    this.erro = '';
    this.carregando = true;

    this.autenticacaoService.login(this.email, this.senha)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: ({ token }) => {
          this.autenticacaoService.salvarToken(token);
          void this.router.navigateByUrl('/home');
        },
        error: (error: HttpErrorResponse) => {
          this.erro = error.status === 400 || error.status === 401
            ? 'E-mail ou senha inválidos.'
            : 'Não foi possível conectar à API. Verifique se o servidor está ativo.';
        },
      });
  }
}
