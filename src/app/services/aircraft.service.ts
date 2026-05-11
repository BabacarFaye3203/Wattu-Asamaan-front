import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay } from 'rxjs';
import {
  Aircraft,
  AircraftAlert,
  TrafficCountry,
  TrafficStats
} from '../models/aircraft.model';
import { HttpClient } from '@angular/common/http';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class AircraftService {
private activeAlertsSubject = new BehaviorSubject<number>(0);

public activeAlerts$ = this.activeAlertsSubject.asObservable();
  // =========================
  //  STATE
  // =========================

  private aircraftSubject = new BehaviorSubject<Aircraft[]>([]);
  private alertsSubject = new BehaviorSubject<AircraftAlert[]>([]);
  private trafficHistorySubject = new BehaviorSubject<number[]>([0]);

  //  STATS SUBJECT
  private statsSubject = new BehaviorSubject<TrafficStats>({
    aircraftCount: 0,
    averageSpeed: 0,
    alertCount: 0
  });

  public aircraft$ = this.aircraftSubject.asObservable();
  public alerts$ = this.alertsSubject.asObservable();
  public trafficHistory$ = this.trafficHistorySubject.asObservable();

  //  DASHBOARD STATS
  public stats$ = this.statsSubject.asObservable();

  //  COUNTRY ANALYTICS
  public trafficByCountry$ = this.aircraft$.pipe(
    map((aircraft) => this.buildCountryTraffic(aircraft)),
    shareReplay(1)
  );

  // =========================
  // 🔌 WEBSOCKET
  // =========================

  private stompClient!: Client;

  constructor(private http: HttpClient) {

  this.loadInitialAlerts();

  this.connectWebSocket();
}

  connectWebSocket() {

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8084/ws'),
      reconnectDelay: 3000,
      debug: (msg) => console.log('[WS]', msg)
    });

    this.stompClient.onConnect = () => {

      console.log('✅ WebSocket connecté');

      // =========================
      //  AIRCRAFT STREAM
      // =========================
      this.stompClient.subscribe('/topic/processed', (message) => {

        const aircraft: Aircraft = JSON.parse(message.body);

        console.log('✈️ AIRCRAFT RECEIVED:', aircraft);

        this.updateAircraft(aircraft);
      });

      // =========================
      //  ALERT STREAM
      // =========================
      this.stompClient.subscribe('/topic/alerts', (message) => {

        const alert: AircraftAlert = JSON.parse(message.body);

        console.log(' ALERT RECEIVED:', alert);

        this.updateAlert(alert);
      });

      // =========================
      //  STATS STREAM
      // =========================
      this.stompClient.subscribe('/topic/stats', (message) => {

        const stats = JSON.parse(message.body);

        console.log('📊 STATS RECEIVED:', stats);

        //  UPDATE DASHBOARD DIRECTEMENT
        const activeAlerts = stats.activeAlerts ?? 0;

      this.activeAlertsSubject.next(activeAlerts);

      this.statsSubject.next({
        aircraftCount: stats.totalAircrafts ?? 0,
        averageSpeed: Math.round(stats.averageSpeed ?? 0),
        alertCount: activeAlerts
      });

      });

    };

    this.stompClient.activate();
  }

  private loadInitialAlerts() {

  this.http
    .get<AircraftAlert[]>('http://localhost:8084/all-allerts')
    .subscribe({

      next: (alerts) => {

        console.log('✅ ALERTS LOADED:', alerts.length);

        this.alertsSubject.next(alerts);
      },

      error: (err) => {

        console.error('❌ Error loading alerts:', err);
      }

    });
}

  // =========================
  //  UPDATE AIRCRAFT
  // =========================

  private updateAircraft(aircraft: any) {

    //  BACKEND ENVOIE latitude/longitude
    if (
      !aircraft ||
      aircraft.latitude == null ||
      aircraft.longitude == null
    ) {
      console.warn('❌ Invalid aircraft ignored:', aircraft);
      return;
    }

    //  MAPPING BACKEND → FRONT
    const mappedAircraft: Aircraft = {
      ...aircraft,
      lat: aircraft.latitude,
      lon: aircraft.longitude,
      speed: aircraft.velocity ?? aircraft.speed ?? 0,
      country: aircraft.originCountry ?? aircraft.country ?? 'Unknown'
    };

    const current = this.aircraftSubject.value;

    const exists = current.find(a => a.id === mappedAircraft.id);

    let updated: Aircraft[];

    if (exists) {

      updated = current.map(a =>
        a.id === mappedAircraft.id ? mappedAircraft : a
      );

    } else {

      updated = [...current, mappedAircraft];
    }

    this.aircraftSubject.next(updated);

    this.trafficHistorySubject.next(
      this.rollHistory(updated.length)
    );

    console.log(' AIRCRAFT COUNT:', updated.length);
  }

  // =========================
  //  UPDATE ALERT
  // =========================

  private updateAlert(alert: AircraftAlert) {

    if (!alert) return;

    const current = this.alertsSubject.value;

    const exists = current.find(a => a.id === alert.id);

if (exists) {

  const updated = current.map(a =>
    a.id === alert.id ? alert : a
  );

  this.alertsSubject.next(updated);

    } else {

      this.alertsSubject.next([
        alert,
        ...current
      ]);
    }
  }

  // =========================
  //  COUNTRY ANALYTICS
  // =========================

  private buildCountryTraffic(
    aircraft: Aircraft[]
  ): TrafficCountry[] {

    const countryMap: Record<string, number> = {};

    aircraft.forEach(a => {

      const country = a.country || 'Unknown';

      countryMap[country] = (countryMap[country] || 0) + 1;
    });

    return Object.entries(countryMap)
      .map(([country, count]) => ({
        country,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }

  // =========================
  //  HISTORY
  // =========================

  private rollHistory(current: number) {

    const prev = this.trafficHistorySubject.value.slice(-9);

    return [...prev, current];
  }

  // =========================
  // CLEANUP
  // =========================

  disconnect() {
    this.stompClient.deactivate();
  }
}