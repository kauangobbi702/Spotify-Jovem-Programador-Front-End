import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacaoService } from '../../services/autenticacao.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nome = '';
  senha = '';

  constructor(private autenticacaoService : AutenticacaoService) { }

  autenticar(){
    this.autenticacaoService.login(this.nome).subscribe(
      (token: string) => {
      this.autenticacaoService.salvarToken(token);
      console.log('Token salvo com sucesso:', token);
      },
      (error) => {
        console.error('Erro ao autentiar:', error);
      }
    )
  }
}
