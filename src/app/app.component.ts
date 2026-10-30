import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AutenticacaoService } from './services/autenticacao.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'MeuDiarioSENAC';

  constructor(private autenticacaoService : AutenticacaoService) {}

  estaAutenticado(): boolean {
    return this.autenticacaoService.estaAutenticado();
  }
}
