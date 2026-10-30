import { Routes } from '@angular/router';
import { HumorComponent } from './components/humor/humor.component';
import { AtividadeComponent } from './components/atividade/atividade.component';
import { PlaylistComponent } from './components/playlist/playlist.component';

export const routes: Routes = [
  { path: '', redirectTo: 'humor', pathMatch: 'full' },
  { path: 'humor', component: HumorComponent },
  { path: 'atividade', component: AtividadeComponent },
  { path: 'playlist', component: PlaylistComponent },
];
