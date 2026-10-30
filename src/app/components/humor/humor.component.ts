import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MoodService } from '../../services/mood-match.service';

@Component({
  selector: 'app-humor',
  standalone: true,
  imports: [],
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
