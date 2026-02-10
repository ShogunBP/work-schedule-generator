import { useTranslation } from '../i18n/TranslationContext';
import { StationConfig } from '../types';

interface StationColorsProps {
  stations: StationConfig[];
  stationColors: Record<string, string>;
  onChangeColor: (station: string, color: string) => void;
  onReset: () => void;
}

export function StationColors({
  stations,
  stationColors,
  onChangeColor,
  onReset
}: StationColorsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">{t('stationColors')}</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded-lg text-sm font-medium transition border border-orange-600/30"
        >
          {t('resetToDefault')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stations.map(station => (
          <div key={station.name} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: stationColors[station.name] || '#666' }}
              ></div>
              <span className="text-white font-semibold text-lg">{station.name}</span>
            </div>
            <input
              type="color"
              value={stationColors[station.name] || '#31405e'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeColor(station.name, e.target.value)}
              className="w-16 h-10 rounded cursor-pointer bg-transparent"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
