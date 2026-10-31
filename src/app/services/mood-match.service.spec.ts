import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MoodService } from './mood-match.service';

describe('MoodMatchService', () => {
  let service: MoodService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MoodService);
    http = TestBed.inject(HttpTestingController);
    localStorage.removeItem('token');
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads mood tracks and resolves artist names from the backend', () => {
    service.humor = service.humores[0];
    service.atividade = service.atividades[3];
    let playlist: ReturnType<typeof service.getPlaylist> extends import('rxjs').Observable<infer T> ? T : never;

    service.getPlaylist().subscribe((resposta) => playlist = resposta);

    const moodRequest = http.expectOne((request) => request.url.endsWith('/usuario/spotify/musicas_mood'));
    expect(moodRequest.request.params.get('emocaoId')).toBe('1');
    expect(moodRequest.request.params.get('atividadeId')).toBe('4');
    moodRequest.flush([
      { idMidia: 12, titulo: 'Canção de teste', artistaId: 3, duracao: '00:03:25' },
    ]);

    http.expectOne('http://localhost:5184/spotify/artistas').flush([
      { idArtista: 3, nome: 'Artista de teste' },
    ]);

    expect(playlist!.musicas[0]).toEqual({
      id: 12,
      titulo: 'Canção de teste',
      artista: 'Artista de teste',
      duracao: '3:25',
    });
  });

  it('posts the selected mood with the saved token', () => {
    localStorage.setItem('token', 'token-de-teste');
    service.humor = service.humores[1];
    service.atividade = service.atividades[4];

    service.salvarPlaylist('Trilha de teste').subscribe();

    const request = http.expectOne('http://localhost:5184/usuario/spotify/criar_playlist_mood');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-de-teste');
    expect(request.request.body).toEqual({
      nomePlaylist: 'Trilha de teste',
      emocaoId: 2,
      atividadeId: 5,
    });
    request.flush({ playlistId: 1, nomePlaylist: 'Trilha de teste', musicasAdicionadas: 1 });
  });
});
