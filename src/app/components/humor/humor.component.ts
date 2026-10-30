import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MoodService } from '../../services/mood-match.service';

@Component({
  selector: 'app-humor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './humor.component.html',
  styleUrl: './humor.component.css'
})
export class HumorComponent {
  constructor(public mood: MoodService, private router: Router) {}

  selecionar(opcao: any) {
    this.mood.humor = opcao;
  }

  proximo() {
    this.router.navigate(['/atividade']);
  }
}
