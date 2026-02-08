import { Calendar } from 'lucide-react';
import { useTranslation } from '../i18n/TranslationContext';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({
  selectedDate,
  onDateChange
}: DateSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        {t('selectDate')}
      </h2>
      
      <div className="flex gap-4 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDateChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          style={{ colorScheme: 'dark' }}
        />
        <button
          onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition"
        >
          {t('today')}
        </button>
      </div>
    </div>
  );
}
