import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticacaoService } from './autenticacao.service';

export interface Artista {
  idArtista: number;
  nome: string;
}

export interface Album {
  idAlbum: number;
  nome: string;
  anoLancamento: number;
  artistaId: number;
}

export interface Midia {
  idMidia: number;
  titulo: string;
  artistaId: number;
  albumId: number;
  duracao: string;
}

export interface Plano {
  idPlano: number;
  descricao: string;
  valor: number;
}

export interface Playlist {
  idPlaylist: number;
  nomePlaylist: string;
}

export interface SalvarPlaylistMoodResponse {
  playlistId: number;
  nomePlaylist: string;
  musicasAdicionadas: number;
}

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {
  private readonly baseUrl = 'http://localhost:5184';

  constructor(
    private http: HttpClient,
    private autenticacao: AutenticacaoService,
  ) {}

  listarPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.baseUrl}/spotify/planos`);
  }

  listarArtistas(): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.baseUrl}/spotify/artistas`);
  }

  listarAlbunsDoArtista(artistaId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/spotify/albuns_artista`, {
      params: new HttpParams().set('artistaId', artistaId),
    });
  }

  listarMusicasDoAlbum(albumId: number): Observable<Midia[]> {
    return this.http.get<Midia[]>(`${this.baseUrl}/spotify/musicas_album`, {
      params: new HttpParams().set('albumId', albumId),
    });
  }

  listarMusicasDoArtista(artistaId: number): Observable<Midia[]> {
    return this.http.get<Midia[]>(`${this.baseUrl}/spotify/musicas_artista`, {
      params: new HttpParams().set('artistaId', artistaId),
    });
  }

  listarArtistasSeguidos(): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.baseUrl}/usuario/spotify/artistas_seguidos`, {
      headers: this.cabecalhoAutenticado(),
    });
  }

  listarMusicasCurtidas(): Observable<Midia[]> {
    return this.http.get<Midia[]>(`${this.baseUrl}/usuario/spotify/musicas_curtidas`, {
      headers: this.cabecalhoAutenticado(),
    });
  }

  curtirMusica(midiaId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/usuario/spotify/curtir_musica`,
      { midiaId },
      { headers: this.cabecalhoAutenticado() },
    );
  }

  descurtirMusica(midiaId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/usuario/spotify/descurtir_musica/${midiaId}`,
      { headers: this.cabecalhoAutenticado() },
    );
  }

  listarPlaylistsDoUsuario(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}/usuario/spotify/playlists_usuario`, {
      headers: this.cabecalhoAutenticado(),
    });
  }

  criarPlaylist(nomePlaylist: string): Observable<Playlist> {
    return this.http.post<Playlist>(
      `${this.baseUrl}/usuario/spotify/criar_playlist`,
      { nomePlaylist },
      { headers: this.cabecalhoAutenticado() },
    );
  }

  seguirArtista(artistaId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/usuario/spotify/curtir_artista`,
      { artistaId },
      { headers: this.cabecalhoAutenticado() },
    );
  }

  deixarDeSeguirArtista(artistaId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/usuario/spotify/deixar_de_seguir_artista/${artistaId}`,
      { headers: this.cabecalhoAutenticado() },
    );
  }

  listarMusicasDaPlaylist(playlistId: number): Observable<Midia[]> {
    return this.http.get<Midia[]>(`${this.baseUrl}/usuario/spotify/musicas_playlist`, {
      headers: this.cabecalhoAutenticado(),
      params: new HttpParams().set('playlistId', playlistId),
    });
  }

  adicionarMusicaPlaylist(playlistId: number, midiaId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/usuario/spotify/adicionar_musica_playlist`,
      { playlistId, midiaId },
      { headers: this.cabecalhoAutenticado() },
    );
  }

  listarMusicasDoMood(emocaoId: number, atividadeId: number): Observable<Midia[]> {
    return this.http.get<Midia[]>(`${this.baseUrl}/usuario/spotify/musicas_mood`, {
      headers: this.cabecalhoAutenticado(),
      params: new HttpParams()
        .set('emocaoId', emocaoId)
        .set('atividadeId', atividadeId),
    });
  }

  salvarPlaylistMood(
    nomePlaylist: string,
    emocaoId: number,
    atividadeId: number,
  ): Observable<SalvarPlaylistMoodResponse> {
    return this.http.post<SalvarPlaylistMoodResponse>(
      `${this.baseUrl}/usuario/spotify/criar_playlist_mood`,
      { nomePlaylist, emocaoId, atividadeId },
      { headers: this.cabecalhoAutenticado() },
    );
  }

  private cabecalhoAutenticado(): HttpHeaders {
    const token = this.autenticacao.retornarToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}