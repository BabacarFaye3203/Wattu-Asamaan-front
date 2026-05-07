import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { AlertsCenterComponent } from './pages/alerts-center/alerts-center.component';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    data: { title: 'Mission Control', subtitle: 'Suivi du trafic aérien en temps réel' }
  },
  {
    path: 'map',
    component: MapPageComponent,
    data: { title: 'Couverture géographique', subtitle: 'Localisation des avions en temps réel' }
  },
  {
    path: 'alerts',
    component: AlertsCenterComponent,
    data: { title: 'Centre d\'alertes', subtitle: 'Gestion centralisée des alertes de trafic' }
  },
  {
    path: 'stats',
    component: StatsPageComponent,
    data: { title: 'Statistiques', subtitle: 'Analyse détaillée du trafic aérien' }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
