import { useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Person } from '../types';
import { convertDayOff } from '../utils/dayMapping';

const DEFAULT_PEOPLE: Person[] = [
  { name: 'Pessoa 1', active: true, dayOff: 'Domingo' },
  { name: 'Pessoa 2', active: true, dayOff: 'Segunda' },
  { name: 'Pessoa 3', active: true, dayOff: 'Terça' },
  { name: 'Pessoa 4', active: true, dayOff: 'Quarta' }
];

export function usePeople(weekDays: string[], currentLanguage: 'pt' | 'en') {
  const [people, setPeople] = useLocalStorage<Person[]>('scheduleData_people', DEFAULT_PEOPLE);
  const [lastLanguage, setLastLanguage] = useLocalStorage<'pt' | 'en'>('lastLanguage', 'pt');
  const conversionInProgressRef = useRef(false);

  // Converter dias da semana quando o idioma muda
  useEffect(() => {
    if (conversionInProgressRef.current || lastLanguage === currentLanguage) {
      return;
    }
    
    conversionInProgressRef.current = true;
    
    const convertedPeople = people.map((person: Person) => ({
      ...person,
      dayOff: convertDayOff(person.dayOff, lastLanguage, currentLanguage)
    }));
    
    setPeople(convertedPeople);
    setLastLanguage(currentLanguage);
    
    conversionInProgressRef.current = false;
  }, [currentLanguage, lastLanguage]);

  const addPerson = (name: string, dayOff: string) => {
    if (name.trim()) {
      setPeople([...people, { 
        name: name.trim(), 
        active: true, 
        dayOff: dayOff || weekDays[0] 
      }]);
    }
  };

  const removePerson = (name: string) => {
    setPeople(people.filter(p => p.name !== name));
  };

  const toggleActive = (name: string) => {
    setPeople(people.map(p => 
      p.name === name ? { ...p, active: !p.active } : p
    ));
  };

  const changeDayOff = (name: string, dayOff: string) => {
    setPeople(people.map(p => 
      p.name === name ? { ...p, dayOff } : p
    ));
  };

  const resetPeople = () => {
    setPeople(DEFAULT_PEOPLE);
  };

  const changePersonName = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setPeople(people.map(p => p.name === oldName ? { ...p, name: trimmed } : p));
  };

  return {
    people,
    addPerson,
    removePerson,
    toggleActive,
    changeDayOff,
    resetPeople
    ,changePersonName
  };
}
