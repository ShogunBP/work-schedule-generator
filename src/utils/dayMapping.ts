// Mapeamento de dias da semana entre idiomas
export const DAY_MAPPING = {
  pt: {
    'Domingo': 0,
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
    'N/A': 7
  },
  en: {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'N/A': 7
  }
} as const;

// Mapeamento inverso para busca eficiente
const REVERSE_MAPPING_PT: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
  7: 'N/A'
};

const REVERSE_MAPPING_EN: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'N/A'
};

export function convertDayOff(dayOff: string, fromLang: 'pt' | 'en', toLang: 'pt' | 'en'): string {
  if (dayOff === 'N/A' || fromLang === toLang) return dayOff;
  
  const fromMapping = DAY_MAPPING[fromLang];
  const dayIndex = (fromMapping as any)[dayOff];
  
  if (dayIndex === undefined) return dayOff;
  
  const reverseMapping = toLang === 'pt' ? REVERSE_MAPPING_PT : REVERSE_MAPPING_EN;
  const toDay = reverseMapping[dayIndex];
  
  return toDay || dayOff;
}

export function getDayIndex(dayOff: string, lang: 'pt' | 'en'): number {
  if (dayOff === 'N/A') return 7;
  const mapping = DAY_MAPPING[lang];
  return (mapping as any)[dayOff] ?? 7;
}

export function getDayByIndex(index: number, lang: 'pt' | 'en'): string {
  const reverseMapping = lang === 'pt' ? REVERSE_MAPPING_PT : REVERSE_MAPPING_EN;
  return reverseMapping[index] || 'N/A';
}
