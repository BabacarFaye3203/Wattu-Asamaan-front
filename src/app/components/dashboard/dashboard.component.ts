import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AircraftService } from '../../services/aircraft.service';
import { DashboardMapComponent } from '../map/map.component';
import { ChartsComponent } from '../charts/charts.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardMapComponent, ChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  stats$ = this.aircraftService.stats$;

  topCountry$ = this.aircraftService.trafficByCountry$.pipe(
    map(list => list?.length ? list[0] : { country: 'N/A', count: 0 })
  );

  constructor(private aircraftService: AircraftService) {}
}