export interface Person {
  name: string;
  active: boolean;
  dayOff: string;
}

export interface StationConfig {
  name: string;
  unique: boolean;
  min2People: boolean;
}

export interface SchedulePerson {
  name: string;
  stations: string[];
}

export interface Schedule {
  selectedDate: string; // ISO date string (YYYY-MM-DD)
  people: SchedulePerson[];
}

export type Algorithm = 'seed' | 'random' | 'manual';
