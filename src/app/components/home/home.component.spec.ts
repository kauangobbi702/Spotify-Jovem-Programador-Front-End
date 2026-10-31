import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Artista, Midia, SpotifyApiService } from '../../services/spotify-api.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let sairSpy: jasmine.Spy;
  let spotifyApi: jasmine.SpyObj<SpotifyApiService>;

  beforeEach(async () => {
    sairSpy = jasmine.createSpy('sair');
    spotifyApi = jasmine.createSpyObj<SpotifyApiService>('SpotifyApiService', [
      'listarArtistas',
      'listarPlanos',
      'listarPlaylistsDoUsuario',
      'listarMusicasCurtidas',
      'listarArtistasSeguidos',
      'curtirMusica',
      'descurtirMusica',
      'seguirArtista',
      'deixarDeSeguirArtista',
      'adicionarMusicaPlaylist',
      'criarPlaylist',
    ]);
    spotifyApi.listarArtistas.and.returnValue(of([]));
    spotifyApi.listarPlanos.and.returnValue(of([]));
    spotifyApi.listarPlaylistsDoUsuario.and.returnValue(of([]));
    spotifyApi.listarMusicasCurtidas.and.returnValue(of([]));
    spotifyApi.listarArtistasSeguidos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: AutenticacaoService, useValue: { sair: sairSpy } },
        { provide: SpotifyApiService, useValue: spotifyApi },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(Router), 'navigateByUrl').and.returnValue(Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to the Mood Match page', () => {
    const moodMatchLink = fixture.nativeElement.querySelector(
      'a.mood-match-button[href="/mood-match"]',
    ) as HTMLAnchorElement | null;

    expect(moodMatchLink?.textContent).toContain('Mood Match');
  });

  it('clears the session when signing out', () => {
    component.sair();

    expect(sairSpy).toHaveBeenCalled();
  });

  it('likes and unlikes a track from the artist details', () => {
    const musica: Midia = {
      idMidia: 12,
      titulo: 'Canção de teste',
      artistaId: 3,
      albumId: 4,
      duracao: '00:03:25',
    };
    spotifyApi.curtirMusica.and.returnValue(of(undefined));
    spotifyApi.descurtirMusica.and.returnValue(of(undefined));

    component.alternarCurtida(musica);

    expect(spotifyApi.curtirMusica).toHaveBeenCalledWith(12);
    expect(component.musicaCurtida(musica)).toBeTrue();

    component.alternarCurtida(musica);

    expect(spotifyApi.descurtirMusica).toHaveBeenCalledWith(12);
    expect(component.musicaCurtida(musica)).toBeFalse();
  });

  it('follows and unfollows the selected artist', () => {
    const artista: Artista = { idArtista: 3, nome: 'Artista de teste' };
    component.artistaSelecionado = artista;
    spotifyApi.seguirArtista.and.returnValue(of(undefined));
    spotifyApi.deixarDeSeguirArtista.and.returnValue(of(undefined));

    component.alternarSeguimentoArtista();

    expect(spotifyApi.seguirArtista).toHaveBeenCalledWith(3);
    expect(component.artistaSeguido(artista)).toBeTrue();

    component.alternarSeguimentoArtista();

    expect(spotifyApi.deixarDeSeguirArtista).toHaveBeenCalledWith(3);
    expect(component.artistaSeguido(artista)).toBeFalse();
  });

  it('adds an artist track to the selected playlist', () => {
    const musica: Midia = {
      idMidia: 12,
      titulo: 'Canção de teste',
      artistaId: 3,
      albumId: 4,
      duracao: '00:03:25',
    };
    component.playlistSelecionadaId = 8;
    spotifyApi.adicionarMusicaPlaylist.and.returnValue(of(undefined));

    component.adicionarMusicaAPlaylist(musica);

    expect(spotifyApi.adicionarMusicaPlaylist).toHaveBeenCalledWith(8, 12);
    expect(component.musicaJaAdicionada(musica)).toBeTrue();
  });

  it('creates a playlist with the trimmed name and selects it', () => {
    const playlist = { idPlaylist: 9, nomePlaylist: 'Minha trilha' };
    component.nomeNovaPlaylist = '  Minha trilha  ';
    spotifyApi.criarPlaylist.and.returnValue(of(playlist));

    component.criarPlaylist();

    expect(spotifyApi.criarPlaylist).toHaveBeenCalledWith('Minha trilha');
    expect(component.playlists).toContain(playlist);
    expect(component.playlistSelecionadaId).toBe(9);
    expect(component.mostrandoFormularioPlaylist).toBeFalse();
    expect(component.mensagemCriacaoPlaylist).toContain('Minha trilha');
  });
});
