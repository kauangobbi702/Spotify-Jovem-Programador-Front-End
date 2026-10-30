import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MoodService {
  humores = [
    { id: 'animado', label: 'Animado', emoji: '😄' },
    { id: 'triste', label: 'Triste', emoji: '😢' },
    { id: 'energetico', label: 'Energético', emoji: '⚡' },
    { id: 'pensativo', label: 'Pensativo', emoji: '🤔' },
    { id: 'romantico', label: 'Romântico', emoji: '💕' },
    { id: 'relaxado', label: 'Relaxado', emoji: '😌' },
    { id: 'irritado', label: 'Irritado', emoji: '😠' },
    { id: 'festivo', label: 'Festivo', emoji: '🥳' },
  ];

  atividades = [
    { id: 'estudando', label: 'Estudando', emoji: '📚' },
    { id: 'correndo', label: 'Correndo', emoji: '🏃' },
    { id: 'cozinhando', label: 'Cozinhando', emoji: '🍳' },
    { id: 'amigos', label: 'Com amigos', emoji: '👫' },
    { id: 'descansando', label: 'Descansando', emoji: '😴' },
    { id: 'lendo', label: 'Lendo', emoji: '📖' },
    { id: 'trabalhando', label: 'Trabalhando', emoji: '💻' },
    { id: 'dirigindo', label: 'Dirigindo', emoji: '🚗' },
    { id: 'meditando', label: 'Meditando', emoji: '🧘' },
  ];

  humor: any = null;
  atividade: any = null;

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

  reiniciar() {
    this.humor = null;
    this.atividade = null;
  }
}