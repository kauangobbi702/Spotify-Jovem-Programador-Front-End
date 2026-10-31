import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, finalize, forkJoin, Observable, of } from 'rxjs';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Album, Artista, Midia, Plano, Playlist, SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, RouterLinkActive],
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
  playlistSelecionadaId: number | null = null;
  tituloDetalhe = '';
  carregando = true;
  carregandoDetalhe = false;
  seguindoArtista = false;
  mostrandoFormularioPlaylist = false;
  criandoPlaylist = false;
  nomeNovaPlaylist = '';
  readonly curtindoMusicas = new Set<number>();
  readonly adicionandoMusicas = new Set<number>();
  readonly musicasAdicionadas = new Set<string>();
  erroCatalogo = '';
  erroBiblioteca = '';
  erroDetalhe = '';
  mensagemAcao = '';
  erroAcao = '';
  mensagemCriacaoPlaylist = '';
  erroCriacaoPlaylist = '';

  constructor(
    private spotifyApi: SpotifyApiService,
    private autenticacao: AutenticacaoService,
    private router: Router,
  ) {}

  sair(): void {
    this.autenticacao.sair();
    void this.router.navigateByUrl('/login');
  }

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
    this.limparFeedbackAcao();
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
    this.artistaSelecionado = null;
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
    this.limparFeedbackAcao();
  }

  musicaCurtida(musica: Midia): boolean {
    return this.musicasCurtidas.some((curtida) => curtida.idMidia === musica.idMidia);
  }

  artistaSeguido(artista: Artista): boolean {
    return this.artistasSeguidos.some((seguido) => seguido.idArtista === artista.idArtista);
  }

  alternarCurtida(musica: Midia): void {
    if (this.curtindoMusicas.has(musica.idMidia)) {
      return;
    }

    this.limparFeedbackAcao();
    this.curtindoMusicas.add(musica.idMidia);
    const curtidaAtual = this.musicaCurtida(musica);
    const requisicao = curtidaAtual
      ? this.spotifyApi.descurtirMusica(musica.idMidia)
      : this.spotifyApi.curtirMusica(musica.idMidia);

    requisicao
      .pipe(finalize(() => this.curtindoMusicas.delete(musica.idMidia)))
      .subscribe({
        next: () => {
          this.musicasCurtidas = curtidaAtual
            ? this.musicasCurtidas.filter((curtida) => curtida.idMidia !== musica.idMidia)
            : [...this.musicasCurtidas, musica];
          this.mensagemAcao = curtidaAtual ? 'Curtida removida.' : 'Música curtida.';
        },
        error: (erro: { status?: number }) => {
          this.erroAcao = erro.status === 401
            ? 'Sua sessão expirou. Entre novamente para curtir músicas.'
            : 'Não foi possível atualizar a curtida. Tente novamente.';
        },
      });
  }

  alternarSeguimentoArtista(): void {
    if (!this.artistaSelecionado || this.seguindoArtista) {
      return;
    }

    const artista = this.artistaSelecionado;
    const seguindo = this.artistasSeguidos.some((item) => item.idArtista === artista.idArtista);
    this.limparFeedbackAcao();
    this.seguindoArtista = true;

    const requisicao = seguindo
      ? this.spotifyApi.deixarDeSeguirArtista(artista.idArtista)
      : this.spotifyApi.seguirArtista(artista.idArtista);

    requisicao
      .pipe(finalize(() => this.seguindoArtista = false))
      .subscribe({
        next: () => {
          this.artistasSeguidos = seguindo
            ? this.artistasSeguidos.filter((item) => item.idArtista !== artista.idArtista)
            : [...this.artistasSeguidos, artista];
          this.mensagemAcao = seguindo ? 'Você deixou de seguir o artista.' : 'Artista seguido.';
        },
        error: (erro: { status?: number }) => {
          this.erroAcao = erro.status === 401
            ? 'Sua sessão expirou. Entre novamente para seguir artistas.'
            : 'Não foi possível atualizar o artista seguido. Tente novamente.';
        },
      });
  }

  adicionarMusicaAPlaylist(musica: Midia): void {
    const playlistId = this.playlistSelecionadaId;
    if (playlistId === null || this.adicionandoMusicas.has(musica.idMidia)) {
      return;
    }

    const chaveAdicao = this.chaveAdicaoPlaylist(playlistId, musica.idMidia);
    this.limparFeedbackAcao();
    this.adicionandoMusicas.add(musica.idMidia);

    this.spotifyApi.adicionarMusicaPlaylist(playlistId, musica.idMidia)
      .pipe(finalize(() => this.adicionandoMusicas.delete(musica.idMidia)))
      .subscribe({
        next: () => {
          this.musicasAdicionadas.add(chaveAdicao);
          this.mensagemAcao = 'Música adicionada à playlist.';
        },
        error: (erro: { status?: number }) => {
          this.erroAcao = erro.status === 401
            ? 'Sua sessão expirou. Entre novamente para adicionar músicas.'
            : 'Não foi possível adicionar a música à playlist. Tente novamente.';
        },
      });
  }

  musicaJaAdicionada(musica: Midia): boolean {
    return this.playlistSelecionadaId !== null
      && this.musicasAdicionadas.has(this.chaveAdicaoPlaylist(this.playlistSelecionadaId, musica.idMidia));
  }

  alternarFormularioPlaylist(): void {
    this.mostrandoFormularioPlaylist = !this.mostrandoFormularioPlaylist;
    this.nomeNovaPlaylist = '';
    this.mensagemCriacaoPlaylist = '';
    this.erroCriacaoPlaylist = '';
  }

  criarPlaylist(): void {
    const nomePlaylist = this.nomeNovaPlaylist.trim();
    if (!nomePlaylist || this.criandoPlaylist) {
      return;
    }

    this.criandoPlaylist = true;
    this.mensagemCriacaoPlaylist = '';
    this.erroCriacaoPlaylist = '';

    this.spotifyApi.criarPlaylist(nomePlaylist)
      .pipe(finalize(() => this.criandoPlaylist = false))
      .subscribe({
        next: (playlist) => {
          this.playlists = [...this.playlists, playlist];
          this.playlistSelecionadaId = playlist.idPlaylist;
          this.nomeNovaPlaylist = '';
          this.mostrandoFormularioPlaylist = false;
          this.mensagemCriacaoPlaylist = `Playlist "${playlist.nomePlaylist}" criada.`;
        },
        error: (erro: { status?: number }) => {
          this.erroCriacaoPlaylist = erro.status === 401
            ? 'Sua sessão expirou. Entre novamente para criar uma playlist.'
            : 'Não foi possível criar a playlist. Tente novamente.';
        },
      });
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
    this.limparFeedbackAcao();
    this.carregandoDetalhe = true;
    musicas$
      .pipe(finalize(() => this.carregandoDetalhe = false))
      .subscribe({
        next: (musicas) => this.musicasDetalhe = musicas,
        error: () => this.erroDetalhe = 'Não foi possível carregar as músicas.',
      });
  }

  private chaveAdicaoPlaylist(playlistId: number, midiaId: number): string {
    return `${playlistId}:${midiaId}`;
  }

  private limparFeedbackAcao(): void {
    this.mensagemAcao = '';
    this.erroAcao = '';
  }
}
