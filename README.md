# Work Schedule Generator

Gerador de Escala de Trabalho / Work Schedule Generator

Uma aplicação web moderna e intuitiva para gerar escalas de trabalho de forma automática, com suporte completo a múltiplos idiomas (Português e Inglês).

## 🌟 Características

- 🌍 **Internacionalização Completa**: Suporte nativo para Português (PT) e Inglês (EN) com tradução em tempo real
- 🎲 **Dois Algoritmos de Geração**:
  - **Baseado em Seed** (determinístico e previsível) - Mesma data sempre gera a mesma escala
  - **Aleatório** - Gera escalas completamente aleatórias
- 🎨 **Personalização Total**:
  - Cores customizáveis para cada posto
  - Gerenciamento completo de pessoas e folgas
  - Configuração flexível de postos e horários
- ⚙️ **Configuração Avançada**:
  - Postos únicos por horário
  - Mínimo de pessoas por posto
  - Horários customizáveis
  - Gerenciamento de pessoas e folgas
- 📥 **Exportação**: Exporta a escala gerada como imagem JPEG de alta qualidade
- 💾 **Persistência**: Dados salvos automaticamente no localStorage
- 🔄 **Algoritmo Inteligente**: Garante alternância obrigatória de postos e respeita regras de postos únicos

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones moderna
- **LocalStorage API** - Persistência de dados no navegador

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

## ✨ Funcionalidades Detalhadas

### Gerenciamento de Pessoas
- ✅ Adicionar/remover pessoas
- ✅ Definir dia de folga para cada pessoa
- ✅ Ativar/desativar pessoas
- ✅ Conversão automática de dias da semana ao mudar idioma

### Configuração de Postos
- ✅ Adicionar/remover postos
- ✅ Renomear postos
- ✅ Definir se o posto é único por horário
- ✅ Definir se o posto requer mínimo de 2 pessoas
- ✅ Cores customizáveis para cada posto

### Gerenciamento de Horários
- ✅ Adicionar/remover horários
- ✅ Editar horários existentes
- ✅ Mínimo de 1 horário obrigatório
- ✅ Ordenação automática dos horários

### Geração de Escala
- ✅ Selecionar data específica
- ✅ Gerar escala automaticamente quando há 3+ pessoas ativas
- ✅ Algoritmo determinístico baseado em seed (mesma data = mesma escala)
- ✅ Algoritmo aleatório para variação
- ✅ Garantia de alternância obrigatória (não repete posto consecutivo)
- ✅ Respeito a regras de postos únicos

### Exportação
- ✅ Exportar escala como imagem JPEG
- ✅ Formato otimizado para compartilhamento
- ✅ Alta qualidade (2x scale)

## 🌐 Internacionalização

A aplicação suporta dois idiomas:
- **Português (PT)** - Idioma padrão
- **Inglês (EN)** - Disponível via botão de idioma

O idioma selecionado é salvo no localStorage e mantido entre sessões. Todos os textos da interface são traduzidos automaticamente, incluindo:
- Títulos e labels
- Mensagens e alertas
- Dias da semana
- Formatação de datas

## 📝 Algoritmos de Geração

### Algoritmo Baseado em Seed (Recomendado)
- Gera escalas determinísticas baseadas na data
- Cada dia terá uma distribuição diferente mas previsível
- Garante alternância obrigatória de postos
- Respeita todas as regras de postos únicos
- Ideal para manter consistência e previsibilidade

### Algoritmo Aleatório
- Gera escalas completamente aleatórias
- Cada geração produz resultados diferentes
- Também garante alternância e regras de postos únicos
- Útil para testar diferentes distribuições

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

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 👨‍💻 Contribuindo

Se desejar contribuir com este projeto, sinta-se à vontade para abrir uma issue ou enviar um pull request. Qualquer contribuição é bem-vinda!

## 👤 Autor

Guilherme Menezes Rodrigues

Email: guilhermemenezes1337@gmail.com
GitHub: https://github.com/ShogunBP
LinkedIn: https://www.linkedin.com/in/mr-guilherme/
