# Work Schedule Generator - Blueprint

## 🌟 Visão Geral do Projeto

O Work Schedule Generator é uma aplicação web moderna e intuitiva para gerar escalas de trabalho de forma automática, com suporte completo a múltiplos idiomas (Português e Inglês). A aplicação é construída com React, TypeScript, Vite e Tailwind CSS, oferecendo uma experiência de usuário rica e responsiva.

### Características Principais

- **Internacionalização Completa**: Suporte nativo para Português (PT) e Inglês (EN) com tradução em tempo real
- **Dois Algoritmos de Geração**:
  - **Baseado em Seed** (determinístico e previsível) - Mesma data sempre gera a mesma escala
  - **Aleatório** - Gera escalas completamente aleatórias
- **Personalização Total**:
  - Cores customizáveis para cada posto
  - Gerenciamento completo de pessoas e folgas
  - Configuração flexível de postos e horários
- **Configuração Avançada**:
  - Postos únicos por horário
  - Mínimo de pessoas por posto
  - Horários customizáveis
  - Gerenciamento de pessoas e folgas
- **Exportação**: Exporta a escala gerada como imagem JPEG de alta qualidade
- **Compartilhamento Móvel**: Botão de compartilhamento para dispositivos móveis que permite compartilhar diretamente para aplicativos como WhatsApp e Instagram
- **Persistência**: Dados salvos automaticamente no localStorage
- **Algoritmo Inteligente**: Garante alternância obrigatória de postos e respeita regras de postos únicos

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones moderna
- **LocalStorage API** - Persistência de dados no navegador

## 📁 Estrutura do Projeto

```
work-schedule-generator/
├── src/
│   ├── App.tsx                    # Componente principal
│   ├── main.tsx                   # Ponto de entrada
│   ├── index.css                  # Estilos globais
│   ├── components/                # Componentes React
│   │   ├── DateSelector.tsx      # Seletor de data
│   │   ├── PeopleManager.tsx     # Gerenciamento de pessoas
│   │   ├── ScheduleDisplay.tsx   # Exibição da escala
│   │   ├── StationColors.tsx     # Cores dos postos
│   │   └── StationConfig.tsx      # Configurações gerais
│   ├── hooks/                     # Hooks customizados
│   │   ├── useLocalStorage.ts    # Hook genérico para localStorage
│   │   ├── usePeople.ts          # Gerenciamento de pessoas
│   │   ├── useStations.ts        # Gerenciamento de postos
│   │   └── useTimeSlots.ts       # Gerenciamento de horários
│   ├── i18n/                      # Sistema de internacionalização
│   │   ├── TranslationContext.tsx # Context API para traduções
│   │   └── translations.ts        # Arquivo de traduções PT/EN
│   ├── types/                     # Definições TypeScript
│   │   └── index.ts               # Interfaces e tipos
│   └── utils/                     # Utilitários
│       ├── dayMapping.ts          # Mapeamento de dias da semana
│       ├── exportUtils.ts        # Exportação para JPEG
│       └── scheduleGenerator.ts   # Lógica de geração de escalas
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório ou baixe os arquivos
2. Instale as dependências:

```bash
npm install
```

### Desenvolvimento

Para rodar em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

Para criar uma build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### Preview da Build

Para visualizar a build de produção:

```bash
npm run preview
```

### Linting

Para verificar problemas de código:

```bash
npm run lint
```

## 📝 Arquitetura e Design

### Padrão de Arquitetura
- **Frontend**: Single Page Application (SPA) com React
- **Estado**: Context API para traduções + Hooks customizados para estado local
- **Persistência**: LocalStorage do navegador
- **Build**: Vite para desenvolvimento e produção

### Fluxo de Dados

```
User Input → Component → Hook → LocalStorage
                ↓
         State Update
                ↓
         Component Re-render
                ↓
         Schedule Generation
                ↓
         Display/Export
```

### Componentes Principais

#### `App.tsx`
- Componente raiz que orquestra toda a aplicação
- Gerencia visibilidade de painéis, escala gerada, algoritmo selecionado e data selecionada
- Coordena a geração de escala e exportação para JPEG

#### Componentes de Interface
- `PeopleManager.tsx` - Interface para gerenciar pessoas
- `StationConfig.tsx` - Configurações gerais (algoritmo, postos, horários)
- `StationColors.tsx` - Seleção de cores dos postos
- `DateSelector.tsx` - Seletor de data
- `ScheduleDisplay.tsx` - Exibição da escala gerada
- `ManualScheduleEditor.tsx` - Interface para edição manual da escala gerada
- `ShareButton.tsx` - Botão de compartilhamento para dispositivos móveis

### Hooks Personalizados

#### `useLocalStorage.ts`
- Hook genérico para abstração do localStorage com sincronização de estado

#### `usePeople.ts`
- Hook de domínio para gerenciamento de pessoas
- Funcionalidades: CRUD de pessoas, conversão de dias da semana
- Persistência: `scheduleData_people`

#### `useStations.ts`
- Hook de domínio para gerenciamento de postos
- Funcionalidades: CRUD de postos, gerenciamento de cores
- Persistência: `scheduleData_stations`, `scheduleData_colors`

#### `useTimeSlots.ts`
- Hook de domínio para gerenciamento de horários
- Funcionalidades: CRUD de horários
- Persistência: `scheduleData_timeSlots`

### Internacionalização

#### `TranslationContext.tsx`
- Context Provider para gerenciamento global de idioma e traduções
- Estado: Idioma atual (`pt` ou `en`)
- Métodos: `t()`, `getWeekDays()`, `formatDate()`, `setLanguage()`

#### `translations.ts`
- Arquivo de dados com todas as strings traduzidas da aplicação
- Estrutura: Objeto com chaves `pt` e `en`

### Utilitários

#### `scheduleGenerator.ts`
- Contém a função principal `generateSchedule()`
- Implementa dois algoritmos de geração: baseado em seed e aleatório
- Utiliza um sistema de multiplicadores para balanceamento de alocação
- Garante regras como alternância de postos e postos únicos por horário

#### `dayMapping.ts`
- Mapeamento entre dias da semana PT/EN
- Funções para conversão de dias entre idiomas

#### `exportUtils.ts`
- Função `exportScheduleToJPEG()` para exportar a escala como imagem JPEG
  - Mantém o estilo visual dos postos (bordas arredondadas)
  - Exibe o texto corretamente no idioma selecionado ('Escala'/'Schedule')
  - Recebe função de tradução para exibir o texto apropriado

## 🧪 Regras de Negócio

### Geração de Escala
1. Mínimo de 2 pessoas disponíveis (não de folga)
2. Mínimo de 3 pessoas ativas para gerar automaticamente
3. Postos únicos: apenas 1 pessoa por horário
4. Alternância obrigatória: não pode repetir posto consecutivo
5. Postos com min2People: só aparecem se houver 2+ pessoas após postos únicos
6. Em modo manual: permite edição livre após geração inicial

### Validações
- Não permite remover último horário
- Não permite postos duplicados
- Não permite horários duplicados
- Valida formato de horário (HH:MM)
- Filtra pessoas com folga na data selecionada

## 🔐 Dados Persistidos

### LocalStorage Keys

- `scheduleData_people` - Lista de pessoas
- `scheduleData_stations` - Configuração de postos
- `scheduleData_colors` - Cores dos postos
- `scheduleData_timeSlots` - Horários configurados
- `scheduleData_algorithm` - Algoritmo selecionado
- `language` - Idioma atual
- `lastLanguage` - Último idioma (para conversão de dias)

## 📊 Performance

### Otimizações Implementadas
- `useCallback` para funções de tradução
- `useMemo` implícito via Context API
- LocalStorage apenas quando necessário
- Componentes funcionais (mais leves que classes)

### Considerações
- Escalas são geradas sob demanda
- Não há chamadas de API (tudo local)
- Renderização otimizada pelo React

## 🚀 Melhorias Futuras

### Possíveis Expansões
- [ ] Suporte a múltiplas escalas (salvar histórico)
- [ ] Exportação em PDF
- [ ] Compartilhamento de configurações
- [ ] Modo escuro/claro
- [ ] Mais idiomas
- [ ] Validação de conflitos mais avançada
- [ ] Estatísticas de distribuição
- [ ] Importação/exportação de dados

## 🔍 Debugging

### Pontos de Verificação
1. **Traduções não atualizam**: Verificar se componente usa `useTranslation()` do Context
2. **Escala não gera**: Verificar se há 3+ pessoas ativas e pessoas disponíveis na data
3. **Escala não viável**: Pode significar restrições muito severas (postos únicos > pessoas disponíveis)
4. **Dias da semana errados**: Verificar `dayMapping.ts` e conversão em `usePeople`
5. **Postos duplicados**: Verificar algoritmo de geração e funções de validação
6. **Modo manual não permite edição**: Verificar se escala foi gerada (necessário 3+ pessoas)

## 📚 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`PeopleManager`)
- **Hooks**: camelCase com prefixo `use` (`usePeople`)
- **Funções**: camelCase (`generateSchedule`)
- **Constantes**: UPPER_SNAKE_CASE (`DEFAULT_TIME_SLOTS`)
- **Tipos/Interfaces**: PascalCase (`Person`, `Schedule`)

### Estrutura de Arquivos
- Um componente por arquivo
- Um hook por arquivo
- Tipos centralizados em `types/index.ts`
- Utilitários agrupados por funcionalidade

### Comentários
- Comentários em português quando necessário
- Código auto-explicativo quando possível
- Documentação de funções complexas
