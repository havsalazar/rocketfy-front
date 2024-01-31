import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { Table, TableModule } from 'primeng/table';

import { BackendService } from './../../../services/backend-service.service';
import { TempHumidity } from './../../../classes/sensor';
import { DatailTableComponent } from './../../common/datail-table/datail-table.component';
import { IoService } from './../../../services/io.service'; 
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-climate',
  standalone: true,
  imports: [ChartModule,
     DatailTableComponent,
     TabViewModule,
    TableModule],
  templateUrl: './climate.component.html',
  styleUrl: './climate.component.scss',
})
export class ClimateComponent implements OnInit ,OnDestroy{
  constructor(private backend: BackendService, private ioservice: IoService) {}
  private realTimeService!: Subscription;
  
  @ViewChild('chart') chart!: UIChart;
  @ViewChild('dt') datatable!: Table;

  @Input({ required: true })
  sensor_id!: any;

  data: any;
  options: any;
  dataTableData:any;

  params = [
    { type: 'humidity', name: 'Humedad' },
    { type: 'temperature', name: 'Temperatura' },
  ];

  ngOnInit(): void {
    this.setOptions();
    this.loadData();
    this.realTimeService=this.ioservice
      .listen('climate-ch') 
      .subscribe((message: string) => {
        const data = JSON.parse(message);  
        this.data.labels.push(data.timestamp);
        this.data.datasets[0].data.push(data.humidity);
        this.data.datasets[1].data.push(data.temperature);
        this.chart.refresh();
        this.dataTableData.unshift(data)
        this.datatable.reset()
        // this.updateTableVisibility()
      });
  } 
  ngOnDestroy(): void {
    this.realTimeService.unsubscribe();
  }

  loadData(): void {
    this.backend.getClimateSensorData(this.sensor_id).subscribe({
      next: (value) => {
        this.processData(value);
        this.dataTableData=value
      },
    });
  } 
  processData(values: TempHumidity[]): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = values.map((o) => o.timestamp);
    const lines = {
      type: 'line',
      label: 'Humedad',
      borderColor: documentStyle.getPropertyValue('--blue-500'),
      borderWidth: 2,
      fill: false,
      yAxisID: 'y',
      tension: 0.4,
      data: values.map((o) => o.humidity),
    };
    const bars = {
      type: 'bar',
      yAxisID: 'y1',
      label: 'Temperatura',
      backgroundColor: documentStyle.getPropertyValue('--orange-500'),
      data: values.map((o) => o.temperature),
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
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          title: {
            display: true,
            text: 'Humedad (%)',
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Temperatura (°C)',
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
