export class Sensor {
  _id?:string;
  sensor_id?: number;
  sensor_name?: string;
  data?: AirNoise[] | WindPressure[] | TempHumidity[] | null;
}

export class AirNoise {
  timestamp?: string;
  noise_level?: number;
  air_quality?: string;
}
export class WindPressure {
  timestamp?: string;
  pressure?: number;
  wind_speed?: number;
}
export class TempHumidity {
  timestamp?: string;
  temperature?: number;
  humidity?: number;
}
