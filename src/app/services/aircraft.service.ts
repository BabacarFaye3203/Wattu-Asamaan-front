import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, map, of, shareReplay, startWith, take, tap } from 'rxjs';
import { Aircraft, AircraftAlert, TrafficCountry, TrafficStats } from '../models/aircraft.model';

@Injectable({ providedIn: 'root' })
export class AircraftService {
  private readonly alertSpeedThreshold = 760;

  private readonly mockAircraft: Aircraft[] = [
    {
      id: 'AC-01',
      callsign: 'VIR321',
      country: 'France',
      speed: 815,
      altitude: 11300,
      lat: 48.8566,
      lon: 2.3522,
      status: 'En route',
      lastSeen: 'maintenant'
    },
    {
      id: 'AC-02',
      callsign: 'SKY128',
      country: 'États-Unis',
      speed: 728,
      altitude: 9800,
      lat: 40.7128,
      lon: -74.006,
      status: 'Stabilisé',
      lastSeen: '30s'
    },
    {
      id: 'AC-03',
      callsign: 'LX987',
      country: 'Suisse',
      speed: 780,
      altitude: 11600,
      lat: 46.948,
      lon: 7.4474,
      status: 'Croisière',
      lastSeen: '15s'
    },
    {
      id: 'AC-04',
      callsign: 'BAW394',
      country: 'Royaume-Uni',
      speed: 665,
      altitude: 10200,
      lat: 51.470,
      lon: -0.4543,
      status: 'Approche',
      lastSeen: '40s'
    },
    {
      id: 'AC-05',
      callsign: 'AFR702',
      country: 'France',
      speed: 798,
      altitude: 12100,
      lat: 43.6045,
      lon: 1.444,
      status: 'En route',
      lastSeen: '12s'
    }
  ];

  private readonly aircraftSubject = new BehaviorSubject<Aircraft[]>(this.mockAircraft);
  private readonly alertsSubject = new BehaviorSubject<AircraftAlert[]>(this.buildAlerts(this.mockAircraft));
  private readonly trafficHistorySubject = new BehaviorSubject<number[]>(this.buildHistory(this.mockAircraft.length));

  public readonly aircraft$ = this.aircraftSubject.asObservable();
  public readonly alerts$ = this.alertsSubject.asObservable();
  public readonly trafficHistory$ = this.trafficHistorySubject.asObservable();
  public readonly trafficByCountry$ = this.aircraft$.pipe(
    map((aircraft) => this.buildCountryTraffic(aircraft)),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  public readonly stats$ = combineLatest([this.aircraft$, this.alerts$]).pipe(
    map(([aircraft, alerts]) => this.buildStats(aircraft, alerts)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor() {
    this.startLiveUpdates();
  }

  getAircraft() {
    return of(this.aircraftSubject.value).pipe(take(1));
  }

  getStats() {
    return this.stats$.pipe(take(1));
  }

  getAlerts() {
    return this.alerts$.pipe(take(1));
  }

  connectWebSocket() {
    // Simule une connexion WebSocket pour le flux temps réel.
    return this.aircraft$;
  }

  startLiveUpdates() {
    interval(3000)
      .pipe(
        startWith(0),
        tap(() => this.refreshMockTraffic())
      )
      .subscribe();
  }

  private refreshMockTraffic() {
    const updatedAircraft = this.aircraftSubject.value.map((aircraft) => {
      const speedVariation = Math.round((Math.random() - 0.45) * 40);
      const altitudeVariation = Math.round((Math.random() - 0.5) * 260);
      const latVariation = (Math.random() - 0.5) * 0.35;
      const lonVariation = (Math.random() - 0.5) * 0.35;

      return {
        ...aircraft,
        speed: Math.max(620, Math.min(840, aircraft.speed + speedVariation)),
        altitude: Math.max(8800, Math.min(12800, aircraft.altitude + altitudeVariation)),
        lat: aircraft.lat + latVariation,
        lon: aircraft.lon + lonVariation,
        lastSeen: 'maintenant'
      };
    });

    this.aircraftSubject.next(updatedAircraft);
    this.alertsSubject.next(this.buildAlerts(updatedAircraft));
    this.trafficHistorySubject.next(this.rollHistory(updatedAircraft.length));
  }

  private buildAlerts(aircraft: Aircraft[]) {
    return aircraft
      .filter((plane) => plane.speed > this.alertSpeedThreshold)
      .map((plane) => ({
        id: plane.id,
        callsign: plane.callsign,
        speed: plane.speed,
        altitude: plane.altitude,
        reason: 'Vitesse supérieure au seuil de sécurité',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
  }

  private buildStats(aircraft: Aircraft[], alerts: AircraftAlert[]): TrafficStats {
    const aircraftCount = aircraft.length;
    const averageSpeed = aircraftCount
      ? Math.round(aircraft.reduce((sum, item) => sum + item.speed, 0) / aircraftCount)
      : 0;

    return {
      aircraftCount,
      averageSpeed,
      alertCount: alerts.length
    };
  }

  private buildCountryTraffic(aircraft: Aircraft[]): TrafficCountry[] {
    const counts = aircraft.reduce<Record<string, number>>((acc, item) => {
      acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  private buildHistory(currentCount: number) {
    return Array.from({ length: 10 }, (_, index) => Math.max(3, currentCount + index - 2));
  }

  private rollHistory(currentCount: number) {
    const previous = this.trafficHistorySubject.value.slice(-9);
    return [...previous, currentCount];
  }
}
