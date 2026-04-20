export interface DailyStat {
  date: string;
  recovery: number;
  strain: number;
  sleep: number;
}

export interface WellnessEntry {
  date: string;
  ctl: number;
  atl: number;
  form: number;
  rampRate: number;
  ctlLoad: number;
  atlLoad: number;
  hrv?: number;
  restingHR?: number;
  sleepSecs?: number;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  start_date_local: string;
  moving_time: number;
  distance?: number;
  tss?: number;
  hr_zones?: number[];
  power_zones?: number[];
}

export interface Athlete {
  ftp?: number;
  lthr?: number;
  run_ftp?: number;
  vo2max?: number;
}

export interface IntervalsData {
  wellness: WellnessEntry[];
  activities: Activity[];
  athlete?: Athlete;
}
