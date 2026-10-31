import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MoodPlaylist, MoodService } from '../../services/mood-match.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  playlist: MoodPlaylist | null = null;
  carregandoPlaylist = true;
  erroPlaylist = '';
  salvando = false;
  playlistSalva = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private mood: MoodService, private router: Router) {}

  ngOnInit() {
    // sem escolhas (ex.: deu F5), volta pro começo
    if (!this.mood.humor || !this.mood.atividade) {
      this.router.navigate(['/humor']);
      return;
    }

    this.mood.getPlaylist()
      .pipe(finalize(() => this.carregandoPlaylist = false))
      .subscribe({
        next: (resposta) => this.playlist = resposta,
        error: (erro) => {
          this.erroPlaylist = erro.status === 401
            ? 'Sua sessão expirou. Entre novamente para buscar músicas.'
            : 'Não foi possível buscar músicas para esta combinação.';
        },
      });
  }

  recomecar() {
    this.mood.reiniciar();
    this.router.navigate(['/humor']);
  }

  salvarPlaylist(): void {
    if (!this.playlist || this.salvando || this.playlistSalva) {
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.mood.salvarPlaylist(this.playlist.titulo)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: (resposta) => {
          this.playlistSalva = true;
          this.mensagemSucesso = `Playlist salva com ${resposta.musicasAdicionadas} músicas.`;
        },
        error: (erro: { status?: number }) => {
          this.mensagemErro = erro.status === 401
            ? 'Sua sessão expirou. Entre novamente para salvar a playlist.'
            : 'Não foi possível salvar a playlist. Tente novamente.';
        },
      });
  }
}
