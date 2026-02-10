import { Share } from 'lucide-react';
import { useTranslation } from '../i18n/TranslationContext';
import { Schedule } from '../types';

interface ShareButtonProps {
  schedule: Schedule | null;
  stationColors: Record<string, string>;
  formatDate: (date: Date) => string;
  getWeekDays: () => string[];
  timeSlots: string[];
}

export function ShareButton({
  schedule,
  stationColors,
  formatDate,
  getWeekDays,
  timeSlots
}: ShareButtonProps) {
  const { t } = useTranslation();

  const handleShare = async () => {
    if (!schedule) return;

    // First, generate the JPEG blob
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 2;
    const width = 800;
    const height = 100 + (schedule.people.length * 45);

    canvas.width = width * scale;
    canvas.height = height * scale;

    ctx.scale(scale, scale);

    // Background gradient (without rounded corners)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    // Parse date string in local timezone to avoid -1 day bug
    const [year, month, day] = schedule.selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDate = formatDate(date);
    const weekDays = getWeekDays();
    const dayOfWeek = weekDays[date.getDay()];
    const title = `Schedule ${formattedDate}`;
    ctx.fillText(title, width / 2, 35);

    // Day
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(dayOfWeek, width / 2, 55);

    // Headers
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('PP', 40, 90);

    ctx.textAlign = 'center';
    timeSlots.forEach((h, idx) => {
      ctx.fillText(h, 200 + idx * 130, 90);
    });

    // People and stations
    let y = 125;
    schedule.people.forEach(person => {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(person.name, 40, y);

      ctx.textAlign = 'center';
      person.stations.forEach((station, idx) => {
        const stationColor = stationColors[station] || '#31405e';
        // Draw rectangle without rounded corners
        ctx.fillStyle = stationColor;
        ctx.fillRect(170 + idx * 130, y - 16, 60, 24);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(station, 200 + idx * 130, y);
      });

      y += 45;
    });

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Check if Web Share API is available (mobile devices)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `schedule-${formattedDate.replace(/ /g, '-')}.jpg`, { type: 'image/jpeg' });
        const shareData = {
          files: [file],
          title: t('schedule'),
          text: `${t('schedule')} ${formattedDate}`,
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            // Success message could be added here if needed
          } catch (err) {
            console.error('Erro ao compartilhar:', err);
            // Fallback to download if sharing fails
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `schedule-${formattedDate.replace(/ /g, '-')}.jpg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        } else {
          console.log('Compartilhamento não suportado para este tipo de conteúdo');
          // Fallback to download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `schedule-${formattedDate.replace(/ /g, '-')}.jpg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      } else {
        // On desktop or unsupported browsers, provide a download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `schedule-${formattedDate.replace(/ /g, '-')}.jpg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', 0.95);
  };

  if (!schedule) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition flex items-center gap-2 border border-white/20"
      title={t('shareSchedule')}
    >
      <Share className="w-5 h-5" />
      {t('share')}
    </button>
  );
}