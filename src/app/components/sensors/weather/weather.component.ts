import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart';
import { WindPressure } from './../../../classes/sensor';
import { BackendService } from './../../../services/backend-service.service';
import { DatailTableComponent } from './../../common/datail-table/datail-table.component';
import { Subscription } from 'rxjs';
import { IoService } from './../../../services/io.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [ChartModule,DatailTableComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit,OnDestroy{
  constructor(private backend: BackendService, private ioservice: IoService) {}
  private realTimeService!: Subscription;
  @ViewChild('chart') chart!: UIChart;

  @Input({ required: true })
  sensor_id!: any;
  data: any;
  options: any;


  params = [
    { type: 'wind_speed', name: 'Velocidad del viento' },
    { type: 'pressure', name: 'Presión' }
  ];

  ngOnInit(): void {
    this.setOptions();
    this.loadData();
    this.realTimeService = this.ioservice
      .listen('weather-ch')
      .subscribe((message: string) => {
        const data = JSON.parse(message); 
        this.data.labels.push(data.timestamp);
        this.data.datasets[0].data.push(data.wind_speed);
        this.data.datasets[1].data.push(data.pressure);
        this.chart.refresh();
      });
  }
  ngOnDestroy(): void {
    this.realTimeService.unsubscribe();
  }
  loadData(): void {
    this.backend.getWeatherSensorData(this.sensor_id).subscribe({
      next: (value) => {
        this.processData(value);
      },
    });
  }
  processData(values: WindPressure[]): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = values.map((o) => o.timestamp);
    const lines = {
      type: 'line',
      label: 'Velocidad del viento',
      borderColor: documentStyle.getPropertyValue('--blue-500'),
      borderWidth: 2,
      fill: false,
      yAxisID: 'y',
      tension: 0.4,
      data: values.map((o) => o.wind_speed),
    };
    const bars = {
      type: 'bar',
      yAxisID: 'y1',
      label: 'Presión',
      backgroundColor: documentStyle.getPropertyValue('--orange-500'),
      data: values.map((o) => o.pressure),
    };
    this.data = {
      labels: labels,
      datasets: [{ ...lines }, { ...bars }],
    };
  }

  setOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            title:{
              display:true,
              text:'test'
            }
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: 'linear',
          display: true,
          title:{
            display:true,
            text:'Velocidad del viento (Km/s)'
          },
          position: 'left',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title:{
            display:true,
            text:'Presión (hPa)'
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
