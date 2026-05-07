import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  barChartData!: ChartConfiguration['data'];
  barChartOptions!: ChartConfiguration['options'];
  
  lineChartData!: ChartConfiguration['data'];
  lineChartOptions!: ChartConfiguration['options'];

  constructor(private aircraftService: AircraftService) {}

  ngOnInit() {
    this.initBarChart();
    this.initLineChart();
  }

  private initBarChart() {
    this.barChartData = {
      labels: ['France', 'Allemagne', 'Italie', 'Espagne', 'Royaume-Uni'],
      datasets: [{
        label: 'Avions par région',
        data: [12, 19, 8, 15, 9],
        backgroundColor: '#0066cc',
        borderColor: '#0052a3',
        borderRadius: 8,
        borderWidth: 0
      }]
    };

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
          ticks: { color: '#6b7280' },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: {
          ticks: { color: '#6b7280' },
          grid: { display: false }
        }
      }
    };
  }

  private initLineChart() {
    this.lineChartData = {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        label: 'Trafic aérien',
        data: [65, 78, 90, 110, 95, 85],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
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
          ticks: { color: '#6b7280' },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: {
          ticks: { color: '#6b7280' },
          grid: { display: false }
        }
      }
    };
  }
}
