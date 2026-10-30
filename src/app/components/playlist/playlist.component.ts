import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MoodService } from '../../services/mood-match.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  playlist: any = null;

  constructor(private mood: MoodService, private router: Router) {}

  ngOnInit() {
    // sem escolhas (ex.: deu F5), volta pro começo
    if (!this.mood.humor || !this.mood.atividade) {
      this.router.navigate(['/humor']);
      return;
    }

    this.mood.getPlaylist().subscribe((resposta) => {
      this.playlist = resposta;
    });
  }

  recomecar() {
    this.mood.reiniciar();
    this.router.navigate(['/humor']);
  }
}
