import { Component,  OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';

import { BackendService } from './../../services/backend-service.service';
import { Sensor } from '../../classes/sensor';



import { WeatherComponent } from '../../components/sensors/weather/weather.component';
import { ClimateComponent } from '../../components/sensors/climate/climate.component';
import { HeaderComponent } from '../../components/header/header.component';
import { EnvironmentalComponent } from '../../components/sensors/environmental/environmental.component'; 


@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [
    DropdownModule,
    HeaderComponent,
    WeatherComponent,
    ClimateComponent,  
    EnvironmentalComponent,
  ],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent implements OnInit {
  sensors: Sensor[] = [];
  selectedSensor?: Sensor;

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.backend.getSensors().subscribe({
      next: (value) => {
        this.sensors = value;
      },
    });
  }
  loadComponentAndData({ value }: any) {
    this.selectedSensor=value
  }
}
