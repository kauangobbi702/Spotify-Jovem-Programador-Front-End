import { CanActivateFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HumorComponent } from './components/humor/humor.component';
import { AtividadeComponent } from './components/atividade/atividade.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AutenticacaoService } from './services/autenticacao.service';

const exigirAutenticacao: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AutenticacaoService).estaAutenticado()
    ? true
    : router.createUrlTree(['/login']);
};

const redirecionarUsuarioAutenticado: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AutenticacaoService).estaAutenticado()
    ? router.createUrlTree(['/home'])
    : true;
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [redirecionarUsuarioAutenticado] },
  { path: 'home', component: HomeComponent, canActivate: [exigirAutenticacao] },
  { path: 'mood-match', pathMatch: 'full', redirectTo: 'humor' },
  { path: 'humor', component: HumorComponent, canActivate: [exigirAutenticacao] },
  { path: 'atividade', component: AtividadeComponent, canActivate: [exigirAutenticacao] },
  { path: 'playlist', component: PlaylistComponent, canActivate: [exigirAutenticacao] },
  { path: '**', redirectTo: 'login' },
];
