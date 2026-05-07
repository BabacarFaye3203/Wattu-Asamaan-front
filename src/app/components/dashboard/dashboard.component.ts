import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AircraftService } from '../../services/aircraft.service';
import { DashboardMapComponent } from '../map/map.component';
import { ChartsComponent } from '../charts/charts.component';
import { Observable, map } from 'rxjs';
import { TrafficStats, TrafficCountry } from '../../models/aircraft.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardMapComponent, ChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats$: Observable<TrafficStats>;
  topCountry$: Observable<TrafficCountry | null>;

  constructor(private aircraftService: AircraftService) {
    this.stats$ = this.aircraftService.stats$;
    this.topCountry$ = this.aircraftService.trafficByCountry$.pipe(
      map((countries) => (countries.length ? countries[0] : null))
    );
  }

  ngOnInit() {
    // Start live updates
    this.aircraftService.startLiveUpdates();
  }
}
