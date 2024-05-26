export interface Time {
  hours: number;
  minutes: number;
}

export interface TimeData {
  data: TimeItem[];
}

export interface TimeItem {
  duration: number;
  time: string;
  by: string;
}

export interface LanguageData {
  field: string;
  minutes: number;
}
