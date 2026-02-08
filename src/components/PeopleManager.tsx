import { useState } from 'react';
import { Users, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from '../i18n/TranslationContext';
import { Person } from '../types';

interface PeopleManagerProps {
  people: Person[];
  weekDays: string[];
  onAddPerson: (name: string, dayOff: string) => void;
  onRemovePerson: (name: string) => void;
  onToggleActive: (name: string) => void;
  onChangeDayOff: (name: string, dayOff: string) => void;
  onReset: () => void;
  onRenamePerson?: (oldName: string, newName: string) => void;
}

export function PeopleManager({
  people,
  weekDays,
  onAddPerson,
  onRemovePerson,
  onToggleActive,
  onChangeDayOff,
  onReset,
  onRenamePerson
}: PeopleManagerProps) {
  const { t } = useTranslation();
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonDayOff, setNewPersonDayOff] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAdd = () => {
    if (newPersonName.trim()) {
      onAddPerson(newPersonName, newPersonDayOff);
      setNewPersonName('');
      setNewPersonDayOff('');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t('managePeople')}
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded-lg text-sm font-medium transition border border-orange-600/30"
        >
          {t('resetToDefault')}
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-white mb-2">{t('addPerson')}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPersonName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPersonName(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAdd()}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            placeholder={t('name')}
          />
          <select
            value={newPersonDayOff}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewPersonDayOff(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            style={{ color: 'white' }}
          >
            <option value="" style={{ background: '#1e293b', color: 'white' }}>{t('dayOff')}</option>
            {weekDays.map((day: string) => (
              <option key={day} value={day} style={{ background: '#1e293b', color: 'white' }}>{day}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition"
          >
            {t('add')}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">{t('registeredPeople')}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {people.map((person: Person) => (
            <div key={person.name} className="bg-white/5 p-3 rounded-lg flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[100px]">
                {editingName === person.name ? (
                  <div className="flex gap-2">
                    <input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm flex-1"
                    />
                    <button
                      onClick={() => {
                        if (editingValue.trim() && onRenamePerson) onRenamePerson(person.name, editingValue.trim());
                        setEditingName(null);
                      }}
                      className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg text-sm"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingName(null)}
                      className="px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{person.name}</span>
                    <button
                      onClick={() => { setEditingName(person.name); setEditingValue(person.name); }}
                      className="ml-2 px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-white text-xs"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <select
                value={weekDays.includes(person.dayOff) ? person.dayOff : weekDays[0]}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChangeDayOff(person.name, e.target.value)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                style={{ color: 'white' }}
              >
                {weekDays.map((day: string) => (
                  <option key={day} value={day} style={{ background: '#1e293b', color: 'white' }}>{day}</option>
                ))}
              </select>
              <button
                onClick={() => onToggleActive(person.name)}
                className={`p-2 rounded-lg transition flex-shrink-0 ${
                  person.active
                    ? 'bg-green-600/20 hover:bg-green-600/30 text-green-300'
                    : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
                }`}
                title={person.active ? t('active') : t('inactive')}
              >
                {person.active ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => onRemovePerson(person.name)}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition flex-shrink-0"
                title={t('remove')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
