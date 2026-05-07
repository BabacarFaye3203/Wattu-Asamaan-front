import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pageService.setPage(
      'dashboard',
      'Mission Control',
      'Suivi du trafic aérien en temps réel'
    );
  }
}
