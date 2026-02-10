import { Schedule } from '../types';

import type { TranslationKey } from '../i18n/translations';

export function exportScheduleToJPEG(
  schedule: Schedule,
  stationColors: Record<string, string>,
  formatDate: (date: Date) => string,
  getWeekDays: () => string[],
  timeSlots: string[],
  t: (key: TranslationKey) => string
): void {
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
  const title = `${t('schedule')} ${formattedDate}`; // Using translation for "Schedule"
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
      const stationColor = stationColors[station] || '#666666';
      // Draw rectangle with rounded corners to match the UI style
      const x = 170 + idx * 130;
      const rectY = y - 16;
      const rectWidth = 60;
      const rectHeight = 24;
      const radius = 6; // Rounded corner radius
      
      ctx.beginPath();
      ctx.moveTo(x + radius, rectY);
      ctx.lineTo(x + rectWidth - radius, rectY);
      ctx.quadraticCurveTo(x + rectWidth, rectY, x + rectWidth, rectY + radius);
      ctx.lineTo(x + rectWidth, rectY + rectHeight - radius);
      ctx.quadraticCurveTo(x + rectWidth, rectY + rectHeight, x + rectWidth - radius, rectY + rectHeight);
      ctx.lineTo(x + radius, rectY + rectHeight);
      ctx.quadraticCurveTo(x, rectY + rectHeight, x, rectY + rectHeight - radius);
      ctx.lineTo(x, rectY + radius);
      ctx.quadraticCurveTo(x, rectY, x + radius, rectY);
      ctx.closePath();
      
      ctx.fillStyle = stationColor;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(station, 200 + idx * 130, y);
    });

    y += 45;
  });

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    // Parse date string in local timezone to avoid -1 day bug
    const [year, month, day] = schedule.selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDate = formatDate(date);
    link.download = `schedule-${formattedDate.replace(/ /g, '-')}.jpg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/jpeg', 0.95);
}
