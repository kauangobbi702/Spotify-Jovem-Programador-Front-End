import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { SpotifyApiService } from '../../services/spotify-api.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: SpotifyApiService,
          useValue: {
            listarArtistas: () => of([]),
            listarPlanos: () => of([]),
            listarPlaylistsDoUsuario: () => of([]),
            listarMusicasCurtidas: () => of([]),
            listarArtistasSeguidos: () => of([]),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
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
});
