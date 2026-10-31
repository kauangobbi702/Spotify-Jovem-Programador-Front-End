import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, finalize, forkJoin, Observable, of } from 'rxjs';
import { Album, Artista, Midia, Plano, Playlist, SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  artistas: Artista[] = [];
  planos: Plano[] = [];
  playlists: Playlist[] = [];
  musicasCurtidas: Midia[] = [];
  artistasSeguidos: Artista[] = [];
  albunsDoArtista: Album[] = [];
  musicasDetalhe: Midia[] = [];
  artistaSelecionado: Artista | null = null;
  tituloDetalhe = '';
  carregando = true;
  carregandoDetalhe = false;
  erroCatalogo = '';
  erroBiblioteca = '';
  erroDetalhe = '';

  constructor(private spotifyApi: SpotifyApiService) {}

  ngOnInit(): void {
    forkJoin({
      artistas: this.spotifyApi.listarArtistas().pipe(catchError(() => {
        this.erroCatalogo = 'Não foi possível carregar o catálogo.';
        return of([] as Artista[]);
      })),
      planos: this.spotifyApi.listarPlanos().pipe(catchError(() => {
        this.erroCatalogo = 'Não foi possível carregar o catálogo.';
        return of([] as Plano[]);
      })),
      playlists: this.spotifyApi.listarPlaylistsDoUsuario().pipe(catchError(() => {
        this.erroBiblioteca = 'Não foi possível carregar sua biblioteca.';
        return of([] as Playlist[]);
      })),
      musicasCurtidas: this.spotifyApi.listarMusicasCurtidas().pipe(catchError(() => {
        this.erroBiblioteca = 'Não foi possível carregar sua biblioteca.';
        return of([] as Midia[]);
      })),
      artistasSeguidos: this.spotifyApi.listarArtistasSeguidos().pipe(catchError(() => {
        this.erroBiblioteca = 'Não foi possível carregar sua biblioteca.';
        return of([] as Artista[]);
      })),
    })
      .pipe(finalize(() => this.carregando = false))
      .subscribe((dados) => {
        this.artistas = dados.artistas;
        this.planos = dados.planos;
        this.playlists = dados.playlists;
        this.musicasCurtidas = dados.musicasCurtidas;
        this.artistasSeguidos = dados.artistasSeguidos;
      });
  }

  selecionarArtista(artista: Artista): void {
    this.artistaSelecionado = artista;
    this.tituloDetalhe = `Músicas de ${artista.nome}`;
    this.albunsDoArtista = [];
    this.musicasDetalhe = [];
    this.erroDetalhe = '';
    this.carregandoDetalhe = true;

    forkJoin({
      albuns: this.spotifyApi.listarAlbunsDoArtista(artista.idArtista),
      musicas: this.spotifyApi.listarMusicasDoArtista(artista.idArtista),
    })
      .pipe(finalize(() => this.carregandoDetalhe = false))
      .subscribe({
        next: (dados) => {
          this.albunsDoArtista = dados.albuns;
          this.musicasDetalhe = dados.musicas;
        },
        error: () => this.erroDetalhe = 'Não foi possível carregar este artista.',
      });
  }

  selecionarAlbum(album: Album): void {
    this.tituloDetalhe = album.nome;
    this.carregarMusicas(this.spotifyApi.listarMusicasDoAlbum(album.idAlbum));
  }

  selecionarPlaylist(playlist: Playlist): void {
    this.artistaSelecionado = null;
    this.albunsDoArtista = [];
    this.tituloDetalhe = playlist.nomePlaylist;
    this.carregarMusicas(this.spotifyApi.listarMusicasDaPlaylist(playlist.idPlaylist));
  }

  fecharDetalhe(): void {
    this.artistaSelecionado = null;
    this.albunsDoArtista = [];
    this.musicasDetalhe = [];
    this.tituloDetalhe = '';
    this.erroDetalhe = '';
  }

  formatarDuracao(duracao: string): string {
    const partes = duracao.split(':');
    if (partes.length !== 3) {
      return duracao;
    }

    const minutos = Number(partes[0]) * 60 + Number(partes[1]);
    const segundos = Number(partes[2].split('.')[0]);
    return `${minutos}:${String(segundos).padStart(2, '0')}`;
  }

  private carregarMusicas(musicas$: Observable<Midia[]>): void {
    this.musicasDetalhe = [];
    this.erroDetalhe = '';
    this.carregandoDetalhe = true;
    musicas$
      .pipe(finalize(() => this.carregandoDetalhe = false))
      .subscribe({
        next: (musicas) => this.musicasDetalhe = musicas,
        error: () => this.erroDetalhe = 'Não foi possível carregar as músicas.',
      });
  }
}
