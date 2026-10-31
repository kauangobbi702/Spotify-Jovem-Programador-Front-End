import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpotifyApiService } from './spotify-api.service';

describe('SpotifyApiService user actions', () => {
  let service: SpotifyApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SpotifyApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends like and unlike requests with the track id', () => {
    service.curtirMusica(12).subscribe();
    const likeRequest = http.expectOne('http://localhost:5184/usuario/spotify/curtir_musica');
    expect(likeRequest.request.method).toBe('POST');
    expect(likeRequest.request.body).toEqual({ midiaId: 12 });
    likeRequest.flush({});

    service.descurtirMusica(12).subscribe();
    const unlikeRequest = http.expectOne('http://localhost:5184/usuario/spotify/descurtir_musica');
    expect(unlikeRequest.request.method).toBe('POST');
    expect(unlikeRequest.request.body).toEqual({ midiaId: 12 });
    unlikeRequest.flush({});
  });

  it('sends follow and unfollow requests with the artist id', () => {
    service.seguirArtista(3).subscribe();
    const followRequest = http.expectOne('http://localhost:5184/usuario/spotify/seguir_artista');
    expect(followRequest.request.method).toBe('POST');
    expect(followRequest.request.body).toEqual({ artistaId: 3 });
    followRequest.flush({});

    service.deixarDeSeguirArtista(3).subscribe();
    const unfollowRequest = http.expectOne('http://localhost:5184/usuario/spotify/deixar_de_seguir_artista');
    expect(unfollowRequest.request.method).toBe('POST');
    expect(unfollowRequest.request.body).toEqual({ artistaId: 3 });
    unfollowRequest.flush({});
  });

  it('sends the selected playlist and track when adding music', () => {
    service.adicionarMusicaPlaylist(8, 12).subscribe();

    const request = http.expectOne('http://localhost:5184/usuario/spotify/adicionar_musica_playlist');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ playlistId: 8, midiaId: 12 });
    request.flush({});
  });

  it('creates a playlist with its requested name', () => {
    service.criarPlaylist('Minha trilha').subscribe();

    const request = http.expectOne('http://localhost:5184/usuario/spotify/criar_playlist');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ nomePlaylist: 'Minha trilha' });
    request.flush({ idPlaylist: 9, nomePlaylist: 'Minha trilha' });
  });
});
