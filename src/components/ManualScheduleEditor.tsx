import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/TranslationContext';
import { Schedule, StationConfig } from '../types';

interface ManualScheduleEditorProps {
  schedule: Schedule;
  stations: StationConfig[];
  stationColors: Record<string, string>;
  timeSlots: string[];
  onUpdate: (schedule: Schedule) => void;
}

export function ManualScheduleEditor({
  schedule,
  stations,
  stationColors,
  timeSlots,
  onUpdate
}: ManualScheduleEditorProps) {
  const { t, getWeekDays, formatDate } = useTranslation();
  const weekDays = getWeekDays();
  const [year, month, day] = schedule.selectedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const formattedDate = formatDate(date);
  const dayOfWeek = weekDays[date.getDay()];
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleStationChange = (personName: string, timeSlotIndex: number, newStation: string) => {
    const updatedSchedule: Schedule = {
      ...schedule,
      people: schedule.people.map(person => {
        if (person.name === personName) {
          const newStations = [...person.stations];
          newStations[timeSlotIndex] = newStation;
          return { ...person, stations: newStations };
        }
        return person;
      })
    };
    onUpdate(updatedSchedule);
    setOpenDropdown(null);
  };

  const getDropdownKey = (personName: string, timeSlotIndex: number) => {
    return `${personName}-${timeSlotIndex}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        {t('schedule')} {formattedDate}
      </h2>
      <p className="text-purple-300 text-center mb-6">{dayOfWeek}</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 font-semibold">PP</th>
              {timeSlots.map(h => (
                <th key={h} className="text-center py-3 px-4 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.people.map((person) => (
              <tr key={person.name} className="border-b border-white/10">
                <td className="py-3 px-4 font-medium">{person.name}</td>
                {person.stations.map((station: string, idx: number) => {
                  const dropdownKey = getDropdownKey(person.name, idx);
                  const isOpen = openDropdown === dropdownKey;
                  
                  return (
                    <td key={`${person.name}-${idx}`} className="text-center py-3 px-4 relative">
                      <div className="relative inline-block" ref={(el) => { dropdownRefs.current[dropdownKey] = el; }}>
                        <button
                          onClick={() => setOpenDropdown(isOpen ? null : dropdownKey)}
                          className="inline-block px-3 py-1 rounded font-bold cursor-pointer transition-all"
                          style={{ 
                            backgroundColor: stationColors[station] || '#666',
                            filter: 'brightness(0.85)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'brightness(1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'brightness(0.85)';
                          }}
                        >
                          {station}
                        </button>
                        {isOpen && (
                          <div className="absolute z-50 mt-1 border border-white/20 rounded shadow-xl overflow-hidden">
                            {stations.map(s => (
                              <button
                                key={s.name}
                                onClick={() => handleStationChange(person.name, idx, s.name)}
                                className="inline-block px-3 py-1 rounded font-bold text-center text-white transition-all w-full"
                                style={{ 
                                  backgroundColor: stationColors[s.name] || '#666',
                                  filter: 'brightness(0.85)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.filter = 'brightness(1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.filter = 'brightness(0.85)';
                                }}
                              >
                                {s.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
