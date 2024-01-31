import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table'; 
import { BackendService } from '../../../services/backend-service.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; 

@Component({
  selector: 'app-datail-table',
  standalone: true,
  imports: [ 
     TableModule,
      DropdownModule,
       FormsModule,
       ButtonModule,
       CommonModule],
  templateUrl: './datail-table.component.html',
  styleUrl: './datail-table.component.scss',
})
export class DatailTableComponent {
  constructor(private backend: BackendService) {} 

  @Input()
  params!: any;
  @Input()
  sensorType!: any;
  @Input()
  sensorId!: any;

  selectedParam!: any;
  analitycData!: any;

  refresh():void{
    this.loadDetail({value:this.selectedParam})
  }
  loadDetail({ value }: any) {
    if (value) {
      const { type } = value;
      switch (this.sensorType) {
        case 'environmental':
          this.backend
            .getEnviromentalCals(this.sensorId, type) 
            .subscribe((value) => (this.analitycData = [{ ...value }]));
          break;
        case 'climate':
          this.backend
            .getClimateCals(this.sensorId, type) 
            .subscribe((value) => (this.analitycData = [{ ...value }]));
          break;
        case 'weather':
          this.backend
            .getWeatherCals(this.sensorId, type) 
            .subscribe((value) => (this.analitycData = [{ ...value }]));
          break;

        default:
          break;
      }
    }
  }
}
