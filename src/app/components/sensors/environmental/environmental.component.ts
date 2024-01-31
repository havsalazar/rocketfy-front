import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart';

import { BackendService } from '../../../services/backend-service.service';
import { AirNoise } from '../../../classes/sensor';
import { SvgBlockComponent } from '../../common/svg-block/svg-block.component';
import { DatailTableComponent } from '../../common/datail-table/datail-table.component';
import { IoService } from '../../../services/io.service';
import { Subscription } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { TableModule,Table } from 'primeng/table';

@Component({
  selector: 'app-environmental',
  standalone: true,
  imports: [
    ChartModule, 
    SvgBlockComponent, 
    DatailTableComponent,
    TabViewModule,
    TableModule

  ],
  providers: [],
  templateUrl: './environmental.component.html',
  styleUrl: './environmental.component.scss',
})
export class EnvironmentalComponent implements OnInit, OnDestroy {
  constructor(private backend: BackendService, private ioservice: IoService) {}
  private realTimeService!: Subscription;
  @ViewChild('chart') chart!: UIChart;
  @ViewChild('dt') datatable!: Table;
  @Input({ required: true })
  sensor_id!: any;
  data: any;
  originData: AirNoise[] = [];
  analitycData: any;
  options: any;
  params = [{ type: 'noise_level', name: 'Nivel de ruido' }];

  ngOnInit(): void {
    this.setOptions();
    this.loadData();
    this.realTimeService = this.ioservice
      .listen('environmental-ch')
      .subscribe((message: string) => {
        const data = JSON.parse(message);
        this.originData.push(data);
        this.data.labels.push(data.timestamp);
        this.data.datasets[0].data.push(data.noise_level);
        this.chart.refresh();
        this.datatable.reset()
      });
  }
  ngOnDestroy(): void {
    this.realTimeService.unsubscribe();
  }

  loadData(): void {
    this.backend.getEnvironmentalSensorData(this.sensor_id).subscribe({
      next: (value) => {
        this.processData(value);
        this.originData = value;
      },
    });
  }
  processData(values: AirNoise[]): void {
    const lines = {
      type: 'bar',
      label: 'Nivel de ruido',
      data: values.map((o) => o.noise_level),
      backgroundColor: (ctx: any) => this.setColor(ctx),
    };
    this.data = {
      labels: values.map((o) => o.timestamp),
      datasets: [{ ...lines }],
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
          display: false,
        },
        tooltip: {
          callbacks: {
            footer:(ctx:any)=> this.customTooltip(ctx),
          }
        }
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
            text: 'Nivel de ruido (db)',
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
  customTooltip(context:any){ 
    let quality='';
    context.forEach((tooltipItem:any)=> {
      const index = tooltipItem.dataIndex;
      if (index !== undefined) {
           quality=`Calidad de aire: ${this.originData[index]?.air_quality}`  
         }
    }); 
    return quality
  }
  //['Buena', 'Moderada', 'Mala', 'Exelente']
  setColor(context: any) {
    const index = context.dataIndex;
    if (index !== undefined) {
      switch (this.originData[index]?.air_quality) {
        case 'Excelente':
          return '#238443';
        case 'Buena':
          return '#C2E699';
        case 'Moderada':
          return '#FFFFB2';
        case 'Mala':
          return '#FF0909';
        default:
          'black';
          break;
      }
    }
    return 'black';
  }
}
