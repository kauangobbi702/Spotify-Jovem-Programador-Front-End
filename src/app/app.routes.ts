import { Routes } from '@angular/router';
import { HumorComponent } from './components/humor/humor.component';
import { AtividadeComponent } from './components/atividade/atividade.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mood-match', redirectTo: 'humor', pathMatch: 'full' },
  { path: 'humor', component: HumorComponent },
  { path: 'atividade', component: AtividadeComponent },
  { path: 'playlist', component: PlaylistComponent },
  { path: 'home', component: HomeComponent }
];
