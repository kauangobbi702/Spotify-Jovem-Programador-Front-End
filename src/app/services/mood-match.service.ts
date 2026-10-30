import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AutenticacaoService } from './autenticacao.service';

export interface SalvarPlaylistMoodResponse {
  playlistId: number;
  nomePlaylist: string;
  musicasAdicionadas: number;
}

@Injectable({ providedIn: 'root' })
export class MoodService {
  humores = [
    { id: 1, label: 'Alegre', emoji: '😄' },
    { id: 2, label: 'Triste', emoji: '😢' },
    { id: 3, label: 'Energético', emoji: '⚡' },
    { id: 4, label: 'Motivado', emoji: '💪' },
    { id: 5, label: 'Reflexivo', emoji: '🤔' },
    { id: 6, label: 'Preguiçoso', emoji: '😌' },
    { id: 7, label: 'Enfurecido', emoji: '😠' },
  ];

  atividades = [
    { id: 1, label: 'Caminhando', emoji: '🚶' },
    { id: 2, label: 'Cozinhando', emoji: '🍳' },
    { id: 3, label: 'Jogando', emoji: '🎮' },
    { id: 4, label: 'Estudando', emoji: '📚' },
    { id: 5, label: 'Relaxando', emoji: '😴' },
    { id: 6, label: 'Trabalhando', emoji: '💻' },
  ];

  humor: (typeof this.humores)[number] | null = null;
  atividade: (typeof this.atividades)[number] | null = null;

  constructor(
    private http: HttpClient,
    private autenticacao: AutenticacaoService,
  ) {}

  getPlaylist(): Observable<any> {
    return of({
      titulo: 'Energia Total 🔥',
      subtitulo: `${this.humor.emoji} ${this.humor.label} + ${this.atividade.emoji} ${this.atividade.label}`,
      musicas: [
        { id: 1, titulo: 'Anunciação - Remix', artista: 'Alceu Valença, Jopin', duracao: '3:42' },
        { id: 2, titulo: 'Blinding Lights', artista: 'The Weeknd', duracao: '3:20' },
        { id: 3, titulo: 'Cheguei', artista: 'Ludmilla', duracao: '2:54' },
        { id: 4, titulo: "Don't Start Now", artista: 'Dua Lipa', duracao: '3:03' },
        { id: 5, titulo: 'Pesadão', artista: 'IZA, Marcelo Falcão', duracao: '3:43' },
        { id: 6, titulo: 'Till I Collapse', artista: 'Eminem', duracao: '4:57' },
        { id: 7, titulo: 'Dog Days Are Over', artista: 'Florence + The Machine', duracao: '4:12' },
      ],
    });
  }

  salvarPlaylist(nomePlaylist: string): Observable<SalvarPlaylistMoodResponse> {
    const token = this.autenticacao.retornarToken();
    if (!token || !this.humor || !this.atividade) {
      return throwError(() => new Error('É necessário estar autenticado e escolher um humor e uma atividade.'));
    }

    return this.http.post<SalvarPlaylistMoodResponse>(
      'http://localhost:5184/usuario/spotify/criar_playlist_mood',
      {
        nomePlaylist,
        emocaoId: this.humor.id,
        atividadeId: this.atividade.id,
      },
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      },
    );
  }

  reiniciar() {
    this.humor = null;
    this.atividade = null;
  }
}