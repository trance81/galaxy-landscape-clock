
export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  location: string;
}

export interface AQIData {
  pm10: number;
  pm25: number;
}

export interface DDayInfo {
  label: string;
  targetDate: string;
}

export enum Tab {
  Clock = 'clock',
  Settings = 'settings',
  Timer = 'timer'
}
