import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AircraftService } from '../../services/aircraft.service';
import { TrafficCountry } from '../../models/aircraft.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
  barChartData!: ChartConfiguration['data'];
  barChartOptions!: ChartConfiguration['options'];

  lineChartData!: ChartConfiguration['data'];
  lineChartOptions!: ChartConfiguration['options'];

  private subscriptions: Subscription = new Subscription();

  constructor(private aircraftService: AircraftService) {}

  ngOnInit() {
    this.initChartOptions();
    this.initBarChart();
    this.initLineChart();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initChartOptions() {
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#1f2937', font: { size: 12, weight: 600 } }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#6b7280', font: { size: 11 } },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: { color: '#6b7280', font: { size: 11 } },
          grid: { color: '#e5e7eb' }
        }
      }
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#1f2937', font: { size: 12, weight: 600 } }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#6b7280', font: { size: 11 } },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: { color: '#6b7280', font: { size: 11 } },
          grid: { color: '#e5e7eb' }
        }
      }
    };
  }

  private initBarChart() {
    // Initialize with empty data
    this.barChartData = {
      labels: [],
      datasets: [{
        label: 'Avions par région',
        data: [],
        backgroundColor: '#0066cc',
        borderColor: '#0052a3',
        borderRadius: 8,
        borderWidth: 0
      }]
    };

    // Subscribe to traffic by country data
    this.subscriptions.add(
      this.aircraftService.trafficByCountry$.subscribe(countries => {
        this.updateBarChart(countries);
      })
    );
  }

  private initLineChart() {
    // Initialize with empty data
    this.lineChartData = {
      labels: [],
      datasets: [{
        label: 'Nombre d\'avions',
        data: [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    // Subscribe to traffic history data
    this.subscriptions.add(
      this.aircraftService.trafficHistory$.subscribe(history => {
        this.updateLineChart(history);
      })
    );
  }

  private updateBarChart(countries: TrafficCountry[]) {
    const labels = countries.map(c => c.country);
    const data = countries.map(c => c.count);

    this.barChartData = {
      ...this.barChartData,
      labels: labels,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: data
      }]
    };
  }

  private updateLineChart(history: number[]) {
    // Generate time labels for the last N points
    const labels = history.map((_, index) => {
      const now = new Date();
      const time = new Date(now.getTime() - (history.length - 1 - index) * 60000); // 1 minute intervals
      return time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    });

    this.lineChartData = {
      ...this.lineChartData,
      labels: labels,
      datasets: [{
        ...this.lineChartData.datasets[0],
        data: history
      }]
    };
  }
}
