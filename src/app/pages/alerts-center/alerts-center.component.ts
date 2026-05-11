import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { AircraftService } from '../../services/aircraft.service';
import { PageService } from '../../services/page.service';
import { Observable } from 'rxjs';

type AlertFilter = 'all' | 'critical' | 'warning';

@Component({
  selector: 'app-alerts-center',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './alerts-center.component.html',
  styleUrls: ['./alerts-center.component.scss']
})
export class AlertsCenterComponent implements OnInit {
  public alerts$ = this.aircraftService.alerts$;
  public activeFilter: AlertFilter = 'all';
  public readonly filters: { label: string; value: AlertFilter }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Critiques', value: 'critical' },
    { label: 'Avertissements', value: 'warning' }
  ];
  public activeAlertsCount$ = this.aircraftService.activeAlerts$;

  constructor(
    private aircraftService: AircraftService,
    private pageService: PageService
  ) {}

  ngOnInit() {
    this.pageService.setPage(
      'alerts',
      'Centre d\'alertes',
      'Anomalies et incidents en cours'
    );
  }

  setFilter(filter: AlertFilter) {
    this.activeFilter = filter;
  }

  getAlertLevel(alert: any): 'critical' | 'warning' {
    return alert.speed > 800 ? 'critical' : 'warning';
  }

  getAlertIcon(level: 'critical' | 'warning'): string {
    return level === 'critical' ? '🚨' : '⚠️';
  }

  dismissAlert(alertId: string) {
    // TODO: Implement alert dismissal
    console.log('Dismiss alert:', alertId);
  }
  filteredAlerts(alerts: any[]) {

  if (this.activeFilter === 'all') {
    return alerts;
  }

  return alerts.filter(alert => {

    const level = this.getAlertLevel(alert);

    return level === this.activeFilter;
  });
}
}
