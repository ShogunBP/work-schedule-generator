import { useState, useEffect } from 'react';
import { Download, Users, Calendar, Settings, Globe } from 'lucide-react';
import { useTranslation } from './i18n/TranslationContext';
import { usePeople } from './hooks/usePeople';
import { useStations } from './hooks/useStations';
import { useTimeSlots } from './hooks/useTimeSlots';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { generateSchedule } from './utils/scheduleGenerator';
import { exportScheduleToJPEG } from './utils/exportUtils';
import { Algorithm, Schedule } from './types';
import { PeopleManager } from './components/PeopleManager';
import { StationConfig } from './components/StationConfig';
import { StationColors } from './components/StationColors';
import { DateSelector } from './components/DateSelector';
import { ScheduleDisplay } from './components/ScheduleDisplay';
import { ManualScheduleEditor } from './components/ManualScheduleEditor';
import { ShareButton } from './components/ShareButton';
import { ToastContainer } from './components/ToastContainer';

const App = () => {
  const { t, language, setLanguage, getWeekDays, formatDate } = useTranslation();
  const { showToast } = useToast();
  const weekDays = getWeekDays();
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [algorithm, setAlgorithm] = useLocalStorage<Algorithm>('scheduleData_algorithm', 'seed');

  const {
    people,
    addPerson,
    removePerson,
    toggleActive,
    changeDayOff,
    resetPeople
  ,changePersonName
  } = usePeople(weekDays, language);

  const {
    stationsConfig,
    stationColors,
    addStation,
    removeStation,
    renameStation,
    toggleStationUnique,
    toggleStationMin2People,
    changeStationColor,
    resetStations,
    resetStationColors
  } = useStations();

  const {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    resetTimeSlots
  } = useTimeSlots();

  useEffect(() => {
    // Always attempt to (re)generate schedule when dependencies change.
    // This ensures that when stations are added/removed, the schedule updates accordingly.
    handleGenerateSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people, stationsConfig, selectedDate, algorithm, language, timeSlots]);

  const handleGenerateSchedule = () => {
    // If algorithm is manual and we have a schedule, we need to be careful not to overwrite manual edits
    // But we still need to regenerate if the station configuration has changed
    if (algorithm === 'manual' && schedule) {
      // Check if the current schedule has the same number of stations as time slots
      const hasCorrectStructure = schedule.people.every(person =>
        person.stations.length === timeSlots.length
      );

      // Check if all configured stations are represented in the current schedule
      const currentStationsSet = new Set<string>();
      schedule.people.forEach(person => {
        person.stations.forEach(station => {
          if (station) currentStationsSet.add(station);
        });
      });

      const allConfiguredStationsPresent = stationsConfig.every(station =>
        currentStationsSet.has(station.name)
      );

      // If the structure is incorrect OR if there are missing stations, regenerate
      if (!hasCorrectStructure || !allConfiguredStationsPresent) {
        const newSchedule = generateSchedule(
          people,
          stationsConfig,
          selectedDate,
          'seed', // Use seed algorithm temporarily to generate a new schedule structure
          weekDays,
          language,
          timeSlots,
          showToast
        );

        if (newSchedule) {
          setSchedule(newSchedule);
        }
      }
      // Otherwise, don't regenerate in manual mode to preserve manual edits
      return;
    }

    // For non-manual algorithms, always regenerate
    const newSchedule = generateSchedule(
      people,
      stationsConfig,
      selectedDate,
      algorithm,
      weekDays,
      language,
      timeSlots,
      showToast
    );

    if (newSchedule) {
      setSchedule(newSchedule);
    }
  };

  const handleManualScheduleUpdate = (updatedSchedule: Schedule) => {
    setSchedule(updatedSchedule);
  };

  const handleExportJPEG = () => {
    if (schedule) {
      exportScheduleToJPEG(schedule, stationColors, formatDate, getWeekDays, timeSlots, t);
    }
  };

  const togglePanel = (panel: 'config' | 'people' | 'colors' | 'date') => {
    if (panel === 'config') {
      setShowConfig(!showConfig);
      setShowPeople(false);
      setShowColors(false);
      setShowDate(false);
    } else if (panel === 'people') {
      setShowPeople(!showPeople);
      setShowConfig(false);
      setShowColors(false);
      setShowDate(false);
    } else if (panel === 'colors') {
      setShowColors(!showColors);
      setShowConfig(false);
      setShowPeople(false);
      setShowDate(false);
    } else if (panel === 'date') {
      setShowDate(!showDate);
      setShowConfig(false);
      setShowPeople(false);
      setShowColors(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            {t('title')}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              title={language === 'pt' ? 'English' : 'Português'}
            >
              <Globe className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => togglePanel('date')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              title={t('selectDateTitle')}
            >
              <Calendar className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => togglePanel('colors')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              title={t('stationColorsTitle')}
            >
              <div className="w-6 h-6 rounded flex items-center justify-center bg-gradient-to-br from-purple-500 via-blue-500 to-green-500"></div>
            </button>
            <button
              onClick={() => togglePanel('people')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              title={t('managePeopleTitle')}
            >
              <Users className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => togglePanel('config')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              title={t('settingsTitle')}
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {showDate && (
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}

        {showColors && (
          <StationColors
            stations={stationsConfig}
            stationColors={stationColors}
            onChangeColor={changeStationColor}
            onReset={resetStationColors}
          />
        )}

        {showPeople && (
          <PeopleManager
            people={people}
            weekDays={weekDays}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
            onToggleActive={toggleActive}
            onChangeDayOff={changeDayOff}
            onReset={resetPeople}
            onRenamePerson={changePersonName}
          />
        )}

        {showConfig && (
          <StationConfig
            stations={stationsConfig}
            stationColors={stationColors}
            algorithm={algorithm}
            timeSlots={timeSlots}
            onAlgorithmChange={setAlgorithm}
            onAddStation={addStation}
            onRemoveStation={removeStation}
            onRenameStation={renameStation}
            onToggleUnique={toggleStationUnique}
            onToggleMin2People={toggleStationMin2People}
            onChangeColor={changeStationColor}
            onAddTimeSlot={addTimeSlot}
            onRemoveTimeSlot={removeTimeSlot}
            onUpdateTimeSlot={updateTimeSlot}
            onResetStations={resetStations}
            onResetTimeSlots={resetTimeSlots}
            onResetAlgorithm={() => {
              setAlgorithm('seed');
              // Regenerate schedule when switching from manual
              if (schedule) {
                setTimeout(() => handleGenerateSchedule(), 0);
              }
            }}
          />
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerateSchedule}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition shadow-lg"
          >
            {t('generateSchedule')}
          </button>
          {schedule && (
            <>
              <button
                onClick={handleExportJPEG}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition flex items-center gap-2 border border-white/20"
              >
                <Download className="w-5 h-5" />
                {t('exportJPEG')}
              </button>
              <ShareButton
                schedule={schedule}
                stationColors={stationColors}
                formatDate={formatDate}
                getWeekDays={getWeekDays}
                timeSlots={timeSlots}
              />
            </>
          )}
        </div>

        {schedule && (
          <div>
            {algorithm === 'manual' ? (
              <ManualScheduleEditor
                schedule={schedule}
                stations={stationsConfig}
                stationColors={stationColors}
                timeSlots={timeSlots}
                onUpdate={handleManualScheduleUpdate}
              />
            ) : (
              <ScheduleDisplay
                schedule={schedule}
                stationColors={stationColors}
                timeSlots={timeSlots}
              />
            )}
          </div>
        )}
      </div>
    </div>
    <ToastContainer />
    </>
  );
};

export default App;
