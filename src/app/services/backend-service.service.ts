import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Sensor,
  AirNoise,
  TempHumidity,
  WindPressure,
} from '../classes/sensor';
import { Observable } from 'rxjs';

import {config} from './../config'

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private url = config.backendUrl;
  constructor(private httpClient: HttpClient) {}

  getSensors(): Observable<Sensor[]> {
    return this.httpClient.get<Array<Sensor>>(`${this.url}/sensors`);
  }
  getClimateSensorData(sensor_id: string): Observable<TempHumidity[]> {
    return this.httpClient.get<Array<TempHumidity>>(
      `${this.url}/climate/getClimateSensorData/${sensor_id}`
    );
  }
  getWeatherSensorData(sensor_id: string): Observable<WindPressure[]> {
    return this.httpClient.get<Array<WindPressure>>(
      `${this.url}/weather/getWeatherSensorData/${sensor_id}`
    );
  }
  getEnvironmentalSensorData(sensor_id: string): Observable<AirNoise[]> {
    return this.httpClient.get<Array<AirNoise>>(
      `${this.url}/enviromental/getEnvironmentalSensorData/${sensor_id}`
    );
  }
  getEnviromentalCals(sensor_id:string,type: string) {
    return this.httpClient.get(`${this.url}/enviromental/getCalcs/${sensor_id}/${type}`);
  }
  getWeatherCals(sensor_id:string,type: string) {
    return this.httpClient.get(`${this.url}/weather/getCalcs/${sensor_id}/${type}`);
  }
  getClimateCals(sensor_id:string,type: string) {
    return this.httpClient.get(`${this.url}/climate/getCalcs/${sensor_id}/${type}`);
  }
}
