import { getDayIndex } from './dayMapping.ts';
import { translations } from '../i18n/translations.ts';
import type { Person, StationConfig, Schedule, SchedulePerson, Algorithm } from '../types/index.ts';

type RNG = () => number;

// ============ RNG UTILITIES ============

function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringToUint32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function buildRng(selectedDate: string, algorithm: Algorithm): RNG {
  if (algorithm === 'random') return Math.random;
  return mulberry32(hashStringToUint32(selectedDate));
}

// ============ HELPERS ============

function getAvailablePeople(
  people: Person[],
  selectedDate: string,
  language: 'pt' | 'en'
): Person[] {
  console.log('\n=== FILTRANDO PESSOAS DISPONÍVEIS ===');
  console.log('Data selecionada:', selectedDate);

  const [year, month, day] = selectedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  console.log('Dia da semana (0=domingo, 1=segunda, ...):', dayOfWeek);

  const availablePeople = people.filter((p) => {
    console.log(`  Verificando disponibilidade de ${p.name}:`);
    console.log(`    Ativo: ${p.active}`);

    if (!p.active) {
      console.log(`    ${p.name} está inativo, excluindo`);
      return false;
    }

    const dayOffIndex = getDayIndex(p.dayOff, language);
    console.log(`    Dia de folga de ${p.name}: ${p.dayOff} (índice: ${dayOffIndex})`);

    if (dayOffIndex === 7) {
      console.log(`    ${p.name} não tem dia de folga fixo, incluindo`);
      return true;
    }

    const isAvailable = dayOffIndex !== dayOfWeek;
    console.log(`    Dia de folga (${dayOffIndex}) !== Dia atual (${dayOfWeek}): ${isAvailable}`);
    return isAvailable;
  });

  console.log('Pessoas disponíveis após filtro:', availablePeople.map(p => p.name));
  return availablePeople;
}

function isMultipleStation(station: StationConfig): boolean {
  const isMultiple = station.min2People && !station.unique;
  console.log(`    Estação ${station.name} é múltipla? min2People=${station.min2People}, unique=${station.unique} -> ${isMultiple}`);
  return isMultiple;
}

function isUniqueStation(station: StationConfig): boolean {
  const isUnique = station.unique;
  console.log(`    Estação ${station.name} é única? unique=${station.unique} -> ${isUnique}`);
  return isUnique;
}

// ============ MULTIPLICADORES E SORTEIO ============

/**
 * Tipos de multiplicadores para cada pessoa
 * Key: nome da pessoa
 * Value: Record com multiplicadores por posto
 */
interface PersonMultipliers {
  [personName: string]: Record<string, number>;
}

/**
 * Inicializa multiplicadores: todos começam com 1
 */
function initializeMultipliers(
  personNames: string[],
  stations: StationConfig[]
): PersonMultipliers {
  console.log('\n=== INICIALIZANDO MULTIPLICADORES ===');
  console.log('Pessoas:', personNames);
  console.log('Estações:', stations.map(s => s.name));

  const multipliers: PersonMultipliers = {};
  personNames.forEach(name => {
    multipliers[name] = {};
    stations.forEach(station => {
      multipliers[name][station.name] = 1;
    });
  });

  console.log('Multiplicadores iniciais criados:', multipliers);
  return multipliers;
}

/**
 * Reseta os multiplicadores de uma pessoa (todas as estações voltam a 1)
 */
function resetPersonMultipliers(
  multipliers: PersonMultipliers,
  personName: string,
  stations: StationConfig[]
): void {
  console.log(`    Resetando multiplicadores para ${personName}:`);
  const previousValues = {...multipliers[personName]};
  stations.forEach(station => {
    multipliers[personName][station.name] = 1;
  });
  console.log(`    Valores anteriores:`, previousValues);
  console.log(`    Valores após reset:`, multipliers[personName]);
}

/**
 * Aplica punição: reduz multiplicador para 0.01
 */
function punishStation(
  multipliers: PersonMultipliers,
  personName: string,
  stationName: string
): void {
  console.log(`    Aplicando punição a ${personName} na estação ${stationName}:`);
  console.log(`      Valor anterior: ${multipliers[personName][stationName]}`);
  multipliers[personName][stationName] = 0.01;
  console.log(`      Valor após punição: ${multipliers[personName][stationName]}`);
}

/**
 * Verifica se uma estação é múltipla (>2 pessoas)
 */
function isStationMultiple(stationName: string, peopleCount: number): boolean {
  return peopleCount > 2;
}

// ============ SORTEIO COM MULTIPLICADORES ============

/**
 * Realiza sorteio ponderado com multiplicadores de chance
 * Seleciona uma estação para uma pessoa baseado nos multiplicadores
 */
function weightedRandomSelection(
  availableStations: StationConfig[],
  personName: string,
  multipliers: PersonMultipliers,
  rng: RNG
): StationConfig {
  // Calcula pesos baseado nos multiplicadores
  const weights = availableStations.map(station => {
    const multiplier = multipliers[personName][station.name] || 1;
    return Math.max(0, multiplier); // garantir não-negativos
  });

  console.log(`  Sorteio ponderado para ${personName}:`);
  console.log(`    Estações disponíveis:`, availableStations.map(s => s.name));
  console.log(`    Multiplicadores:`, multipliers[personName]);
  console.log(`    Pesos calculados:`, weights);

  // Soma ponderada
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) {
    console.log(`    Peso total <= 0, usando fallback aleatório`);
    // Fallback: escolher aleatoriamente
    const randomIndex = Math.floor(rng() * availableStations.length);
    console.log(`    Índice aleatório escolhido: ${randomIndex}, Estação: ${availableStations[randomIndex].name}`);
    return availableStations[randomIndex];
  }

  // Normalizar pesos para [0, 1]
  const normalizedWeights = weights.map(w => w / totalWeight);
  console.log(`    Pesos normalizados:`, normalizedWeights);

  // Selecionar baseado na distribuição
  const r = rng();
  console.log(`    Número aleatório gerado: ${r}`);

  let accumulated = 0;
  for (let i = 0; i < availableStations.length; i++) {
    accumulated += normalizedWeights[i];
    console.log(`    Acumulado até índice ${i} (${availableStations[i].name}): ${accumulated}`);
    if (r <= accumulated) {
      console.log(`    Escolhendo estação ${availableStations[i].name} (índice ${i})`);
      return availableStations[i];
    }
  }

  // Fallback
  console.log(`    Usando fallback - última estação: ${availableStations[availableStations.length - 1].name}`);
  return availableStations[availableStations.length - 1];
}

// ============ VALIDAÇÕES ============

/**
 * Verifica se uma estação única tem exatamente 1 pessoa alocada
 */
function validateUniqueStation(
  assignment: Record<string, string>,
  stationName: string
): boolean {
  let count = 0;
  for (const station of Object.values(assignment)) {
    if (station === stationName) count++;
  }
  return count === 1;
}

/**
 * Verifica se todos os postos únicos foram preenchidos
 */
function allUniquesAssigned(
  assignment: Record<string, string>,
  uniqueStations: string[]
): boolean {
  const assigned = new Set(Object.values(assignment));
  console.log(`    Verificando se todos os postos únicos foram preenchidos:`);
  console.log(`      Postos únicos esperados:`, uniqueStations);
  console.log(`      Postos atribuídos:`, Array.from(assigned));

  for (const station of uniqueStations) {
    const isAssigned = assigned.has(station);
    console.log(`      Posto único ${station} está atribuído? ${isAssigned}`);
    if (!isAssigned) return false;
  }
  return true;
}

/**
 * Verifica se uma pessoa pode ser alocada a mais postos (não deve repetir mesmo posto único no slot anterior)
 */
function canAssignStation(
  personName: string,
  stationName: string,
  prevAssignment: Record<string, string> | null,
  stationConfig: Map<string, StationConfig>
): boolean {
  console.log(`    Verificando se ${personName} pode receber ${stationName}:`);

  if (!prevAssignment) {
    console.log(`      Não há alocação anterior, pode atribuir`);
    return true;
  }

  const prevStation = prevAssignment[personName];
  console.log(`      Alocação anterior de ${personName}: ${prevStation || 'nenhuma'}`);

  if (!prevStation) {
    console.log(`      Não havia alocação anterior para ${personName}, pode atribuir`);
    return true;
  }

  // Se for mesmo posto e for único, não pode repetir
  const stationCfg = stationConfig.get(stationName);
  const isUnique = stationCfg?.unique;
  const isSameStation = prevStation === stationName;

  console.log(`      Estação ${stationName} é única? ${isUnique}`);
  console.log(`      É a mesma estação do slot anterior? ${isSameStation}`);

  if (isUnique && isSameStation) {
    console.log(`      Não pode atribuir: é posto único e repetiria no mesmo slot`);
    return false;
  }

  console.log(`      Pode atribuir: não é posto único ou não é repetição`);
  return true;
}

// ============ ALOCAÇÃO DE HORÁRIO ============

/**
 * Aloca pessoas em estações para um horário específico
 * Implementa sorteio com multiplicadores e garante postos únicos preenchidos
 */
function allocateTimeSlot(
  personNames: string[],
  stations: StationConfig[],
  slotIdx: number,
  prevAssignment: Record<string, string> | null,
  multipliers: PersonMultipliers,
  rng: RNG,
  maxAttempts: number = 200
): Record<string, string> | null {
  console.log(`\n=== Alocando horário ${slotIdx} ===`);
  console.log(`Pessoas disponíveis:`, personNames);
  console.log(`Estações disponíveis:`, stations.map(s => s.name));
  console.log(`Multiplicadores antes da alocação:`, multipliers);

  const uniqueStations = stations.filter(isUniqueStation).map(s => s.name);
  const stationConfigMap = new Map(stations.map(s => [s.name, s]));

  // Múltiplas tentativas de sorteio
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const assignment: Record<string, string> = {};
    const assignedStations = new Set<string>();

    // Embaralhar ordem de pessoas
    const shuffledPeople = [...personNames].sort(() => rng() - 0.5);
    console.log(`Tentativa ${attempt + 1}: Ordem das pessoas embaralhadas:`, shuffledPeople);

    let success = true;
    for (const personName of shuffledPeople) {
      // Filtrar estações disponíveis para essa pessoa
      const available = stations.filter(station => {
        // Não pode atribuir a um único que já foi atribuído
        if (station.unique && assignedStations.has(station.name)) {
          console.log(`  ${personName} - Estação ${station.name} já está ocupada (única)`);
          return false;
        }
        // Validação de repetição
        if (!canAssignStation(personName, station.name, prevAssignment, stationConfigMap)) {
          console.log(`  ${personName} - Não pode atribuir ${station.name} (repetição de posto único no slot anterior)`);
          return false;
        }
        return true;
      });

      console.log(`  ${personName} - Estações disponíveis:`, available.map(s => s.name));
      console.log(`  ${personName} - Multiplicadores:`, multipliers[personName]);

      if (available.length === 0) {
        console.log(`  ${personName} - Nenhuma estação disponível!`);
        success = false;
        break;
      }

      // Sorteio ponderado pela chance (multiplicador)
      const station = weightedRandomSelection(available, personName, multipliers, rng);
      console.log(`  ${personName} - Atribuído à estação: ${station.name}`);

      assignment[personName] = station.name;
      if (station.unique) {
        assignedStations.add(station.name);
        console.log(`  Estação ${station.name} agora está ocupada (única)`);
      }
    }

    console.log(`  Atribuição parcial:`, assignment);

    // Validar se todos os postos únicos foram preenchidos
    const allUniquesFilled = allUniquesAssigned(assignment, uniqueStations);
    console.log(`  Todos os postos únicos preenchidos? ${allUniquesFilled}`, uniqueStations);

    if (success && allUniquesFilled) {
      console.log(`  ✓ Alocação bem-sucedida para o horário ${slotIdx}!`);
      console.log(`  Atribuição final:`, assignment);
      return assignment;
    } else {
      console.log(`  ✗ Tentativa ${attempt + 1} falhou. Success: ${success}, Uniques filled: ${allUniquesFilled}`);
    }
  }

  console.log(`✗ Falha ao alocar horário ${slotIdx} após ${maxAttempts} tentativas`);
  return null;
}

// ============ GERADOR DE ESCALA ============

export function generateSchedule(
  people: Person[],
  stationsConfig: StationConfig[],
  selectedDate: string,
  algorithm: Algorithm,
  _weekDays: string[],
  language: 'pt' | 'en',
  timeSlots: string[],
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
): Schedule | null {
  console.log('\n=== INICIANDO GERAÇÃO DE ESCALA ===');
  console.log('Data selecionada:', selectedDate);
  console.log('Algoritmo:', algorithm);
  console.log('Horários:', timeSlots);
  console.log('Pessoas recebidas:', people);
  console.log('Estações recebidas:', stationsConfig);

  const t = translations[language];
  const availablePeople = getAvailablePeople(people, selectedDate, language);
  console.log('Pessoas disponíveis após filtro de folga:', availablePeople);

  const toast = showToast || ((msg: string) => console.log(msg as any));

  // Validações básicas
  if (availablePeople.length < 2) {
    toast(t.alertNeed2People, 'error');
    return null;
  }

  const uniqueStations = stationsConfig.filter(s => s.unique);
  if (availablePeople.length < uniqueStations.length) {
    const msg = language === 'pt'
      ? `Pessoas disponíveis insuficientes para preencher os postos únicos (${uniqueStations.map(s => s.name).join(', ')}).`
      : `Not enough available people to fill unique stations (${uniqueStations.map(s => s.name).join(', ')}).`;
    toast(msg, 'error');
    return null;
  }

  // Validar postos múltiplos: requerem >2 pessoas distintas
  // Se não houver pessoas suficientes, remover esses postos da alocação
  const multipleStations = stationsConfig.filter(s => isMultipleStation(s));
  let effectiveStations = stationsConfig;

  if (multipleStations.length > 0 && availablePeople.length <= 2) {
    // Remover postos múltiplos se houver 2 ou menos pessoas
    const removedStations = multipleStations.map(s => s.name).join(', ');
    const msg = language === 'pt'
      ? `Apenas ${availablePeople.length} pessoas disponíveis. Postos múltiplos removidos: ${removedStations}`
      : `Only ${availablePeople.length} people available. Multiple stations removed: ${removedStations}`;
    toast(msg, 'warning');

    effectiveStations = stationsConfig.filter(s => !isMultipleStation(s));
  }

  console.log('Estações efetivas após filtragem:', effectiveStations);

  // Validar postos únicos efetivos
  const effectiveUniqueStations = effectiveStations.filter(s => s.unique);
  if (availablePeople.length < effectiveUniqueStations.length) {
    const msg = language === 'pt'
      ? `Pessoas disponíveis insuficientes para preencher os postos únicos (${effectiveUniqueStations.map(s => s.name).join(', ')}).`
      : `Not enough available people to fill unique stations (${effectiveUniqueStations.map(s => s.name).join(', ')}).`;
    toast(msg, 'error');
    return null;
  }

  // Inicializar estrutura de escala
  const personNames = availablePeople.map(p => p.name);
  console.log('Nomes das pessoas disponíveis:', personNames);

  const schedulePeople: SchedulePerson[] = personNames.map(name => ({
    name,
    stations: []
  }));

  // Inicializar multiplicadores (usar estações efetivas)
  const multipliers = initializeMultipliers(personNames, effectiveStations);
  console.log('Multiplicadores iniciais:', multipliers);

  // Construir RNG
  const rng = buildRng(selectedDate, algorithm);
  console.log('Gerador de números aleatórios criado');

  // Alocar cada horário
  let prevAssignment: Record<string, string> | null = null;
  console.log('\n=== INICIANDO ALOCAÇÃO POR HORÁRIO ===');

  for (let slotIdx = 0; slotIdx < timeSlots.length; slotIdx++) {
    const timeSlot = timeSlots[slotIdx];
    console.log(`\n--- Processando horário ${slotIdx + 1}/${timeSlots.length}: ${timeSlot} ---`);

    // Tentar alocar esse horário (usar estações efetivas)
    const assignment = allocateTimeSlot(
      personNames,
      effectiveStations,
      slotIdx,
      prevAssignment,
      multipliers,
      rng,
      300
    );

    if (!assignment) {
      const msg = language === 'pt'
        ? `Não foi possível gerar escala válida para o horário ${timeSlot}.`
        : `Could not generate valid schedule for time slot ${timeSlot}.`;
      toast(msg, 'error');
      return null;
    }

    // Registrar alocação
    console.log(`\nRegistro de alocação para horário ${timeSlot}:`, assignment);
    Object.entries(assignment).forEach(([personName, stationName]) => {
      const person = schedulePeople.find(p => p.name === personName)!;
      person.stations.push(stationName);
      console.log(`  ${personName} -> ${stationName}`);
    });

    // Aplicar regras de multiplicadores
    console.log('\nAplicando regras de multiplicadores...');
    Object.entries(assignment).forEach(([personName, stationName]) => {
      const stationCfg = effectiveStations.find(s => s.name === stationName)!;

      if (isUniqueStation(stationCfg)) {
        console.log(`  ${personName} recebeu posto único ${stationName} - aplicando punição`);
        punishStation(multipliers, personName, stationName);
      } else if (isMultipleStation(stationCfg)) {
        console.log(`  ${personName} recebeu posto múltiplo ${stationName} - resetando multiplicadores`);
        resetPersonMultipliers(multipliers, personName, effectiveStations);
      }
    });

    console.log('Multiplicadores após aplicação das regras:', multipliers);

    prevAssignment = assignment;
  }

  console.log('\n=== ESCALA GERADA COM SUCESSO ===');
  console.log('Escala final:', {
    selectedDate,
    people: schedulePeople
  });

  return {
    selectedDate,
    people: schedulePeople
  };
}
