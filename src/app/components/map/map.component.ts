import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-dashboard-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class DashboardMapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  private map!: L.Map;
  private markers: Map<string, L.Marker> = new Map();

  constructor(private aircraftService: AircraftService) {}

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
      // Subscribe to aircraft data after map is initialized
      this.aircraftService.aircraft$.subscribe(aircraft => {
        aircraft.forEach(plane => {
          this.updateMarker(plane);
        });
      });
    }, 100);
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([48.8566, 2.3522], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private updateMarker(aircraft: any) {
    if (this.markers.has(aircraft.id)) {
      const marker = this.markers.get(aircraft.id)!;
      marker.setLatLng([aircraft.latitude, aircraft.longitude]);
    } else {
      const marker = L.marker([aircraft.latitude, aircraft.longitude], {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          iconSize: [25, 41],
          popupAnchor: [1, -34]
        })
      }).bindPopup(`<strong>${aircraft.callsign}</strong><br/>${aircraft.speed} km/h`);

      marker.addTo(this.map);
      this.markers.set(aircraft.id, marker);
    }
  }
}
