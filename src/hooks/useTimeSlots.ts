import { useLocalStorage } from './useLocalStorage';

const DEFAULT_TIME_SLOTS = ['15:20', '17:00', '19:00', '21:00'];

export function useTimeSlots() {
  const [timeSlots, setTimeSlots] = useLocalStorage<string[]>('scheduleData_timeSlots', DEFAULT_TIME_SLOTS);

  const addTimeSlot = (timeSlot: string) => {
    if (timeSlot.trim() && !timeSlots.includes(timeSlot.trim())) {
      setTimeSlots([...timeSlots, timeSlot.trim()].sort());
    }
  };

  const removeTimeSlot = (timeSlot: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter(t => t !== timeSlot));
    }
  };

  const updateTimeSlot = (oldTimeSlot: string, newTimeSlot: string) => {
    if (newTimeSlot.trim() && (newTimeSlot.trim() === oldTimeSlot || !timeSlots.includes(newTimeSlot.trim()))) {
      setTimeSlots(timeSlots.map(t => t === oldTimeSlot ? newTimeSlot.trim() : t).sort());
    }
  };

  const resetTimeSlots = () => {
    setTimeSlots(DEFAULT_TIME_SLOTS);
  };

  return {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    resetTimeSlots
  };
}
