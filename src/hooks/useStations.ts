import { useLocalStorage } from './useLocalStorage';
import { StationConfig } from '../types';

const DEFAULT_STATIONS: StationConfig[] = [
  { name: 'P2', unique: true, min2People: false },
  { name: 'P3', unique: true, min2People: false },
  { name: 'P4', unique: false, min2People: false }
];

const DEFAULT_COLORS: Record<string, string> = {
  P2: '#9333ea',
  P3: '#2563eb',
  P4: '#059669'
};

export function useStations() {
  const [stationsConfig, setStationsConfig] = useLocalStorage<StationConfig[]>(
    'scheduleData_stations',
    DEFAULT_STATIONS
  );
  const [stationColors, setStationColors] = useLocalStorage<Record<string, string>>(
    'scheduleData_colors',
    DEFAULT_COLORS
  );

  const addStation = (name: string) => {
    if (name.trim() && !stationsConfig.find(s => s.name === name.trim())) {
      setStationsConfig([...stationsConfig, {
        name: name.trim(),
        unique: false,
        min2People: false
      }]);
      setStationColors({
        ...stationColors,
        [name.trim()]: '#' + Math.floor(Math.random() * 16777215).toString(16)
      });
    }
  };

  const removeStation = (stationName: string) => {
    setStationsConfig(stationsConfig.filter(s => s.name !== stationName));
    const newColors = { ...stationColors };
    delete newColors[stationName];
    setStationColors(newColors);
  };

  const renameStation = (oldName: string, newName: string) => {
    if (!newName.trim() || stationsConfig.find(s => s.name === newName.trim() && s.name !== oldName)) {
      return;
    }

    setStationsConfig(
      stationsConfig.map(s => s.name === oldName ? { ...s, name: newName.trim() } : s)
    );

    const newColors = { ...stationColors };
    newColors[newName.trim()] = newColors[oldName];
    delete newColors[oldName];
    setStationColors(newColors);
  };

  const toggleStationUnique = (stationName: string) => {
    setStationsConfig(
      stationsConfig.map(s => s.name === stationName ? { ...s, unique: !s.unique } : s)
    );
  };

  const toggleStationMin2People = (stationName: string) => {
    setStationsConfig(
      stationsConfig.map(s => s.name === stationName ? { ...s, min2People: !s.min2People } : s)
    );
  };

  const changeStationColor = (station: string, color: string) => {
    setStationColors({ ...stationColors, [station]: color });
  };

  const resetStations = () => {
    setStationsConfig(DEFAULT_STATIONS);
    setStationColors(DEFAULT_COLORS);
  };

  const resetStationColors = () => {
    setStationColors(DEFAULT_COLORS);
  };

  return {
    stationsConfig,
    stationColors,
    addStation,
    removeStation,
    renameStation,
    toggleStationUnique,
    toggleStationMin2People,
    changeStationColor,
    resetStations,
    resetStationColors
  };
}
