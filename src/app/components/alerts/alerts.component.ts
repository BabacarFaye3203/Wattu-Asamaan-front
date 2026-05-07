import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AircraftService } from '../../services/aircraft.service';
import { AircraftAlert } from '../../models/aircraft.model';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  alerts$: Observable<AircraftAlert[]>;

  constructor(private aircraftService: AircraftService) {
    this.alerts$ = this.aircraftService.alerts$;
  }

  ngOnInit(): void {
    // Observable subscription handled by async pipe in template
  }
}
