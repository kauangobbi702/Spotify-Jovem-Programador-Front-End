import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, throwError } from 'rxjs';
import { SalvarPlaylistMoodResponse, SpotifyApiService } from './spotify-api.service';

export interface MoodPlaylistTrack {
  id: number;
  titulo: string;
  artista: string;
  duracao: string;
}

export interface MoodPlaylist {
  titulo: string;
  subtitulo: string;
  musicas: MoodPlaylistTrack[];
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

  constructor(private spotifyApi: SpotifyApiService) {}

  getPlaylist(): Observable<MoodPlaylist> {
    if (!this.humor || !this.atividade) {
      return throwError(() => new Error('Escolha um humor e uma atividade para gerar a playlist.'));
    }

    const humor = this.humor;
    const atividade = this.atividade;

    return forkJoin({
      musicas: this.spotifyApi.listarMusicasDoMood(humor.id, atividade.id),
      artistas: this.spotifyApi.listarArtistas(),
    }).pipe(map(({ musicas, artistas }) => ({
      titulo: `${humor.label} + ${atividade.label}`,
      subtitulo: `${humor.emoji} ${humor.label} + ${atividade.emoji} ${atividade.label}`,
      musicas: musicas.map((musica) => ({
        id: musica.idMidia,
        titulo: musica.titulo,
        artista: artistas.find((artista) => artista.idArtista === musica.artistaId)?.nome ?? 'Catálogo Spotify',
        duracao: this.formatarDuracao(musica.duracao),
      })),
    })));
  }

  salvarPlaylist(nomePlaylist: string): Observable<SalvarPlaylistMoodResponse> {
    if (!this.humor || !this.atividade) {
      return throwError(() => new Error('É necessário estar autenticado e escolher um humor e uma atividade.'));
    }

    return this.spotifyApi.salvarPlaylistMood(nomePlaylist, this.humor.id, this.atividade.id);
  }

  reiniciar() {
    this.humor = null;
    this.atividade = null;
  }

  private formatarDuracao(duracao: string): string {
    const [horas, minutos, segundos] = duracao.split(':');
    if (minutos === undefined || segundos === undefined) {
      return duracao;
    }

    const minutosTotais = Number(horas) * 60 + Number(minutos);
    const segundosInteiros = Number(segundos.split('.')[0]);
    return `${minutosTotais}:${String(segundosInteiros).padStart(2, '0')}`;
  }
}