import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { AlertsCenterComponent } from './pages/alerts-center/alerts-center.component';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';
import { PageService } from './services/page.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardPageComponent,
    MapPageComponent,
    AlertsCenterComponent,
    StatsPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'Mission Control';
  pageSubtitle = 'Suivi du trafic aérien en temps réel';
  userInitials = 'AC';
  userName = 'Air Control';
  userRole = 'Administrateur';
  currentPage = 'dashboard';

  navItems = [
    { label: 'Dashboard', page: 'dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Carte', page: 'map', icon: '🗺️', route: '/map' },
    { label: 'Graphiques', page: 'stats', icon: '📈', route: '/stats' },
    { label: 'Alertes', page: 'alerts', icon: '🚨', route: '/alerts' }
  ];

  constructor(
    private pageService: PageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageService.page$.subscribe((page) => {
      this.pageTitle = page.title;
      this.pageSubtitle = page.subtitle;
      this.currentPage = this.pageService.currentPage;
    });

    this.router.events.subscribe(() => {
      this.currentPage = this.pageService.currentPage;
    });
  }

  navigateTo(route: string, page: string) {
    this.router.navigate([route]);
    this.pageService.currentPage = page;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleTheme() {
    // TODO: Implement theme toggle
  }

  logout() {
    // TODO: Implement logout
  }
}
