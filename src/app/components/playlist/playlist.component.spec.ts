import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PlaylistComponent } from './playlist.component';
import { MoodService } from '../../services/mood-match.service';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;
  let moodService: jasmine.SpyObj<MoodService>;

  beforeEach(async () => {
    moodService = jasmine.createSpyObj<MoodService>(
      'MoodService',
      ['getPlaylist', 'salvarPlaylist', 'reiniciar'],
      {
        humor: { id: 1, label: 'Alegre', emoji: '😄' },
        atividade: { id: 1, label: 'Caminhando', emoji: '🚶' },
      },
    );
    moodService.getPlaylist.and.returnValue(of({
      titulo: 'Alegre + Caminhando',
      subtitulo: '😄 Alegre + 🚶 Caminhando',
      musicas: [{ id: 1, titulo: 'Música', artista: 'Artista', duracao: '3:00' }],
    }));
    moodService.salvarPlaylist.and.returnValue(of({
      playlistId: 1,
      nomePlaylist: 'Minha trilha',
      musicasAdicionadas: 1,
    }));

    await TestBed.configureTestingModule({
      imports: [PlaylistComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: MoodService, useValue: moodService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the edited playlist name when saving', () => {
    const input = fixture.nativeElement.querySelector('#nome-playlist') as HTMLInputElement;
    expect(input.value).toBe('Alegre + Caminhando');

    input.value = 'Minha trilha';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.salvarPlaylist();

    expect(moodService.salvarPlaylist).toHaveBeenCalledWith('Minha trilha');
  });
});
