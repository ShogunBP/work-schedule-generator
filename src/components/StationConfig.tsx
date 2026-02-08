import { useState } from 'react';
import { Settings, Trash2, X, Check } from 'lucide-react';
import { useTranslation } from '../i18n/TranslationContext';
import { StationConfig as StationConfigType } from '../types';

interface StationConfigProps {
  stations: StationConfigType[];
  stationColors: Record<string, string>;
  algorithm: 'seed' | 'random' | 'manual';
  timeSlots: string[];
  onAlgorithmChange: (algorithm: 'seed' | 'random' | 'manual') => void;
  onAddStation: (name: string) => void;
  onRemoveStation: (name: string) => void;
  onRenameStation: (oldName: string, newName: string) => void;
  onToggleUnique: (name: string) => void;
  onToggleMin2People: (name: string) => void;
  onChangeColor: (station: string, color: string) => void;
  onAddTimeSlot: (timeSlot: string) => void;
  onRemoveTimeSlot: (timeSlot: string) => void;
  onUpdateTimeSlot: (oldTimeSlot: string, newTimeSlot: string) => void;
  onResetStations: () => void;
  onResetTimeSlots: () => void;
  onResetAlgorithm: () => void;
}

export function StationConfig({
  stations,
  stationColors,
  algorithm,
  timeSlots,
  onAlgorithmChange,
  onAddStation,
  onRemoveStation,
  onRenameStation,
  onToggleUnique,
  onToggleMin2People,
  onChangeColor,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot,
  onResetStations,
  onResetTimeSlots,
  onResetAlgorithm
}: StationConfigProps) {
  const { t } = useTranslation();
  // Referencing some props to avoid unused-variable TS errors when not used in this file
  void stationColors;
  void onChangeColor;
  const [newStationName, setNewStationName] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [editingTimeSlot, setEditingTimeSlot] = useState<string | null>(null);
  const [editingTimeSlotValue, setEditingTimeSlotValue] = useState<string>('');

  const handleAddStation = () => {
    if (newStationName.trim()) {
      onAddStation(newStationName);
      setNewStationName('');
    }
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot.trim()) {
      onAddTimeSlot(newTimeSlot);
      setNewTimeSlot('');
    }
  };

  const formatTimeInput = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 4 dígitos
    const limited = numbers.slice(0, 4);
    
    // Formata como HH:MM
    if (limited.length === 0) return '';
    if (limited.length <= 2) return limited;
    return `${limited.slice(0, 2)}:${limited.slice(2)}`;
  };

  const validateTimeFormat = (value: string): boolean => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        {t('settings')}
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">{t('algorithm')}</h3>
          <button
            onClick={onResetAlgorithm}
            className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded text-sm font-medium transition border border-orange-600/30"
          >
            {t('reset')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => onAlgorithmChange('seed')}
            className={`p-3 rounded-lg cursor-pointer transition ${
              algorithm === 'seed' 
                ? 'bg-purple-600 border-2 border-purple-400' 
                : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
            }`}
          >
            <h4 className="text-white font-semibold mb-1">{t('seedBased')}</h4>
            <p className="text-white/70 text-sm">
              {t('seedDescription')}
            </p>
          </div>
          
          <div 
            onClick={() => onAlgorithmChange('random')}
            className={`p-3 rounded-lg cursor-pointer transition ${
              algorithm === 'random' 
                ? 'bg-purple-600 border-2 border-purple-400' 
                : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
            }`}
          >
            <h4 className="text-white font-semibold mb-1">{t('random')}</h4>
            <p className="text-white/70 text-sm">
              {t('randomDescription')}
            </p>
          </div>

          <div 
            onClick={() => onAlgorithmChange('manual')}
            className={`p-3 rounded-lg cursor-pointer transition ${
              algorithm === 'manual' 
                ? 'bg-purple-600 border-2 border-purple-400' 
                : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
            }`}
          >
            <h4 className="text-white font-semibold mb-1">{t('manual')}</h4>
            <p className="text-white/70 text-sm">
              {t('manualDescription')}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">{t('manageStations')}</h3>
          <button
            onClick={onResetStations}
            className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded text-sm font-medium transition border border-orange-600/30"
          >
            {t('resetToDefault')}
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-white mb-2">{t('addStation')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStationName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStationName(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddStation()}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              placeholder={t('stationName')}
            />
            <button
              onClick={handleAddStation}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition"
            >
              {t('add')}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white mb-2">{t('configuredStations')}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {stations.map(station => (
              <div key={station.name} className="bg-white/5 p-3 rounded-lg flex items-center gap-2 flex-wrap md:flex-nowrap">
                <input
                  type="text"
                  value={station.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRenameStation(station.name, e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white font-medium w-20 flex-shrink-0"
                />
                <div className="flex gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleUnique(station.name)}
                    className={`flex-1 px-3 py-1 rounded transition text-sm ${
                      station.unique
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {station.unique ? t('uniquePerTime') : t('multipleAllowed')}
                  </button>
                  <button
                    onClick={() => onToggleMin2People(station.name)}
                    className={`flex-1 px-3 py-1 rounded transition text-sm ${
                      station.min2People
                        ? 'bg-orange-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {station.min2People ? t('min2People') : t('noMinimum')}
                  </button>
                </div>
                <button
                  onClick={() => onRemoveStation(station.name)}
                  className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition flex-shrink-0 md:ml-auto"
                  title={t('remove')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">{t('manageTimeSlots')}</h3>
            <button
              onClick={onResetTimeSlots}
              className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded text-sm font-medium transition border border-orange-600/30"
            >
              {t('resetToDefault')}
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-white mb-2">{t('addTimeSlot')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTimeSlot}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatTimeInput(e.target.value);
                  setNewTimeSlot(formatted);
                }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && validateTimeFormat(newTimeSlot.trim())) {
                    handleAddTimeSlot();
                  }
                }}
                maxLength={5}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder={t('timeSlotPlaceholder')}
              />
              <button
                onClick={handleAddTimeSlot}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition"
              >
                {t('add')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">{t('configuredTimeSlots')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {timeSlots.map(timeSlot => {
                const isEditing = editingTimeSlot === timeSlot;
                const currentValue = isEditing ? editingTimeSlotValue : timeSlot;
                const trimmedValue = editingTimeSlotValue.trim();
                const isValidFormat = validateTimeFormat(trimmedValue);
                const isDuplicate = isEditing && trimmedValue !== timeSlot && timeSlots.includes(trimmedValue);
                const hasChanged = isEditing && trimmedValue !== timeSlot && trimmedValue !== '';
                const canConfirm = hasChanged && !isDuplicate && trimmedValue !== '' && isValidFormat;
                
                return (
                  <div key={timeSlot} className="bg-white/5 p-2 rounded-lg flex items-center gap-1.5 min-w-0">
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const rawValue = e.target.value;
                        const formatted = formatTimeInput(rawValue);
                        
                        if (!isEditing) {
                          setEditingTimeSlot(timeSlot);
                          setEditingTimeSlotValue(formatted);
                        } else {
                          setEditingTimeSlotValue(formatted);
                        }
                      }}
                      onBlur={() => {
                        // Se o valor está formatado corretamente, tenta salvar
                        if (isEditing && validateTimeFormat(trimmedValue) && canConfirm) {
                          onUpdateTimeSlot(timeSlot, trimmedValue);
                        }
                        setEditingTimeSlot(null);
                        setEditingTimeSlotValue('');
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' && canConfirm && validateTimeFormat(trimmedValue)) {
                          onUpdateTimeSlot(timeSlot, trimmedValue);
                          setEditingTimeSlot(null);
                          setEditingTimeSlotValue('');
                        } else if (e.key === 'Escape') {
                          setEditingTimeSlot(null);
                          setEditingTimeSlotValue('');
                        }
                      }}
                      maxLength={5}
                      placeholder="HH:MM"
                      className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-medium text-sm flex-1 min-w-0"
                    />
                    {isEditing && hasChanged ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingTimeSlot(null);
                            setEditingTimeSlotValue('');
                          }}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition flex-shrink-0"
                          title={t('cancel')}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (canConfirm) {
                              onUpdateTimeSlot(timeSlot, trimmedValue);
                            }
                            setEditingTimeSlot(null);
                            setEditingTimeSlotValue('');
                          }}
                          disabled={!canConfirm}
                          className={`p-1.5 rounded transition flex-shrink-0 ${
                            !canConfirm
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600/20 hover:bg-green-600/30 text-green-300'
                          }`}
                          title={t('confirm')}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onRemoveTimeSlot(timeSlot)}
                        disabled={timeSlots.length <= 1 || isEditing}
                        className={`p-1.5 rounded transition flex-shrink-0 ${
                          timeSlots.length <= 1 || isEditing
                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600/20 hover:bg-red-600/30 text-red-300'
                        }`}
                        title={t('remove')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
