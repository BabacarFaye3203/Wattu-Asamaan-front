export interface Aircraft {
  id: string;
  callsign: string;
  country: string;
  speed: number;
  altitude: number;
  lat: number;
  lon: number;
  status: string;
  lastSeen: string;
}

export interface AircraftAlert {
  id: string;
  callsign: string;
  speed: number;
  altitude: number;
  reason: string;
  timestamp: string;
}

export interface TrafficStats {
  aircraftCount: number;
  averageSpeed: number;
  alertCount: number;
}

export interface TrafficCountry {
  country: string;
  count: number;
}
