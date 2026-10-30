import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MoodService } from '../../services/mood-match.service';

@Component({
  selector: 'app-atividade',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './atividade.component.html',
  styleUrl: './atividade.component.css'
})
export class AtividadeComponent {
  constructor(public mood: MoodService, private router: Router) {
    if (!this.mood.humor) {
      this.router.navigate(['/humor']);
    }
  }

  selecionar(opcao: any) {
    this.mood.atividade = opcao;
  }

  verPlaylist() {
    this.router.navigate(['/playlist']);
  }
}
