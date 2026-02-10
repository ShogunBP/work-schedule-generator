import { useTranslation } from '../i18n/TranslationContext';
import { Schedule } from '../types';

interface ScheduleDisplayProps {
  schedule: Schedule;
  stationColors: Record<string, string>;
  timeSlots: string[];
}

export function ScheduleDisplay({
  schedule,
  stationColors,
  timeSlots
}: ScheduleDisplayProps) {
  const { t, getWeekDays, formatDate } = useTranslation();
  const weekDays = getWeekDays();
  // Parse date string in local timezone to avoid -1 day bug
  const [year, month, day] = schedule.selectedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const formattedDate = formatDate(date);
  const dayOfWeek = weekDays[date.getDay()];

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
                {person.stations.map((station: string, idx: number) => (
                  <td key={`${person.name}-${idx}`} className="text-center py-3 px-4">
                    <span
                      className="inline-block px-3 py-1 rounded font-bold"
                      style={{
                        backgroundColor: stationColors[station] || '#31405e' // Adiciona cor padrão caso não exista
                      }}
                    >
                      {station}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
