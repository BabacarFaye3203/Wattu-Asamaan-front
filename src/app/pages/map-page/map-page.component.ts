import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMapComponent } from '../../components/map/map.component';
import { PageService } from '../../services/page.service';
import L from 'leaflet';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, DashboardMapComponent],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit {
  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pageService.setPage(
      'map',
      'Couverture géographique',
      'Localisation des avions en temps réel'
    );
  }
  
  updateMarker(aircraft: any) {
  if (!aircraft?.latitude || !aircraft?.longitude) {
    return;
  }

  L.marker([aircraft.latitude, aircraft.longitude]);
}
}
