import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from '../../components/charts/charts.component';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, ChartsComponent],
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent implements OnInit {
  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pageService.setPage(
      'stats',
      'Statistiques',
      'Analyse détaillée du trafic aérien'
    );
  }
}
