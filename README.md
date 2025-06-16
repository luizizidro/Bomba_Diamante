# Sistema de Seleção de Bombas

Um sistema avançado para seleção e análise de bombas centrífugas com gráficos interativos e cálculos de performance em tempo real.

## 🚀 Demo

Acesse a aplicação em produção: [https://fastidious-cranachan-b93ba3.netlify.app](https://fastidious-cranachan-b93ba3.netlify.app)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 📖 Sobre o Projeto

O Sistema de Seleção de Bombas é uma aplicação web desenvolvida para engenheiros e técnicos que trabalham com sistemas de bombeamento. A ferramenta permite:

- Visualizar curvas características de diferentes modelos de bombas
- Calcular pontos de operação específicos
- Analisar performance e eficiência
- Comparar diferentes modelos de bombas
- Verificar condições de cavitação (NPSH)

### Modelos de Bombas Disponíveis

1. **BC-21 R 1/2 (Modelo 1)** - Indústrias Schneider
   - Potência: 3 cv
   - Vazão máxima: 25 m³/h
   - Altura máxima: 45 m

2. **BC-21 R 1/2 (Modelo 2)** - Indústrias Schneider
   - Potência: 4 cv
   - Vazão máxima: 30 m³/h
   - Altura máxima: 50 m

3. **Bomba Diamante** - Bomba Personalizada
   - Potência: 46.5 cv
   - Vazão máxima: 180 m³/h
   - Altura: -10 a 200 m (suporta alturas negativas)

## ✨ Funcionalidades

### 🎯 Principais Recursos

- **Seleção de Bombas**: Interface intuitiva para escolher entre diferentes modelos
- **Controles de Operação**: Ajuste de vazão e altura manométrica
- **Gráficos Interativos**: Visualização das curvas características:
  - Altura x Vazão
  - Potência x Vazão
  - NPSH x Vazão
  - Rendimento x Vazão
- **Cálculo de Pontos**: Marcação de pontos específicos de operação no gráfico
- **Análise de Performance**: Avaliação automática da eficiência operacional
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

### 🔧 Funcionalidades Técnicas

- **Interpolação Linear**: Cálculos precisos entre pontos das curvas
- **Validação de Dados**: Verificação automática de limites operacionais
- **Suporte a Valores Negativos**: Especialmente para a Bomba Diamante
- **Interface Moderna**: Design clean com animações suaves
- **Feedback Visual**: Indicadores visuais para diferentes estados da aplicação

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Chart.js** - Biblioteca para gráficos interativos
- **React Chart.js 2** - Wrapper React para Chart.js
- **Lucide React** - Ícones modernos e consistentes

### Desenvolvimento
- **Vite** - Build tool e dev server
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Prefixos CSS automáticos

### Testes
- **Vitest** - Framework de testes
- **Testing Library** - Utilitários para testes de componentes
- **jsdom** - Ambiente DOM para testes
- **@vitest/ui** - Interface gráfica para testes
- **@vitest/coverage-v8** - Relatórios de cobertura

### Deploy
- **Netlify** - Hospedagem e deploy contínuo

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)

Verificar versões:
```bash
node --version
npm --version
```

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/pump-selection-system.git
cd pump-selection-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
Abra seu navegador e vá para `http://localhost:5173`

## 📱 Como Usar

### 1. Seleção de Bomba
- Use o dropdown na seção "Seleção de Bomba" para escolher o modelo desejado
- As especificações técnicas serão exibidas automaticamente
- O gráfico será atualizado com as curvas características da bomba selecionada

### 2. Definição do Ponto de Operação
- Ajuste a **Vazão (m³/h)** usando o campo de entrada
- Defina a **Altura (m)** desejada
- Os valores são validados automaticamente conforme os limites da bomba

### 3. Cálculo e Visualização
- Clique no botão **"Calcular"** para marcar o ponto no gráfico
- O ponto calculado aparecerá destacado em amarelo/laranja
- Use o botão **"X"** para limpar o ponto calculado

### 4. Interpretação dos Resultados
- **Curva Vermelha**: Altura manométrica
- **Curva Azul**: Potência requerida
- **Curva Verde**: NPSH requerido
- **Curva Roxa**: Rendimento da bomba

### 5. Análise de Performance
- Observe o "Ponto de Operação Atual" para valores em tempo real
- Valores negativos de altura são destacados em vermelho
- Mensagens de confirmação indicam quando um ponto foi calculado

## 📁 Estrutura do Projeto

```
pump-selection-system/
├── public/
│   └── vite.svg
├── src/
│   ├── components/           # Componentes React
│   │   ├── __tests__/       # Testes dos componentes
│   │   ├── ControlPanel.tsx # Painel de controles
│   │   ├── PumpChart.tsx    # Gráfico das curvas
│   │   ├── PumpSelector.tsx # Seletor de bombas
│   │   └── ResultsPanel.tsx # Painel de resultados
│   ├── data/                # Dados das bombas
│   │   ├── __tests__/       # Testes dos dados
│   │   └── pumpModels.ts    # Modelos de bombas
│   ├── types/               # Definições TypeScript
│   │   └── pump.ts          # Tipos relacionados a bombas
│   ├── utils/               # Utilitários e cálculos
│   │   ├── __tests__/       # Testes dos utilitários
│   │   └── pumpCalculations.ts # Cálculos das curvas
│   ├── test/                # Configuração de testes
│   │   └── setup.tsx        # Setup do ambiente de testes
│   ├── __tests__/           # Testes de integração
│   │   └── App.integration.test.tsx
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── dist/                    # Build de produção
├── package.json             # Dependências e scripts
├── vite.config.ts           # Configuração do Vite
├── vitest.config.ts         # Configuração dos testes
├── tailwind.config.js       # Configuração do Tailwind
├── tsconfig.json            # Configuração do TypeScript
└── README.md                # Este arquivo
```

### Componentes Principais

#### `App.tsx`
Componente raiz que gerencia o estado global da aplicação e coordena a comunicação entre os componentes filhos.

#### `PumpSelector.tsx`
Responsável pela seleção de bombas e exibição das especificações técnicas.

#### `ControlPanel.tsx`
Painel de controle para ajuste de vazão, altura e cálculo de pontos de operação.

#### `PumpChart.tsx`
Componente que renderiza o gráfico interativo com as curvas características da bomba.

#### `ResultsPanel.tsx`
Painel para exibição de resultados calculados e análise de performance.

## 🧪 Testes

O projeto possui uma suíte completa de testes incluindo testes unitários e de integração.

### Executar Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com interface gráfica
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Tipos de Testes

#### Testes Unitários
- **Componentes**: Testam comportamento individual de cada componente
- **Utilitários**: Verificam cálculos matemáticos e funções auxiliares
- **Dados**: Validam estrutura e consistência dos modelos de bombas

#### Testes de Integração
- **Fluxo Completo**: Testam interação entre componentes
- **Estados da Aplicação**: Verificam mudanças de estado
- **Casos Extremos**: Testam valores limites e situações especiais

### Cobertura de Testes

O projeto mantém alta cobertura de testes:
- **Componentes**: 100%
- **Utilitários**: 100%
- **Integração**: 95%+

## 🚀 Deploy

### Deploy Automático (Netlify)

O projeto está configurado para deploy automático no Netlify:

1. **Build de Produção**
```bash
npm run build
```

2. **Preview Local**
```bash
npm run preview
```

3. **Deploy Manual**
```bash
# O build é gerado na pasta dist/
# Faça upload da pasta dist/ para seu provedor de hospedagem
```

### Configurações de Deploy

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+

### Variáveis de Ambiente

Não são necessárias variáveis de ambiente para este projeto.

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
```bash
git checkout -b feature/AmazingFeature
```

3. **Commit suas mudanças**
```bash
git commit -m 'Add some AmazingFeature'
```

4. **Push para a branch**
```bash
git push origin feature/AmazingFeature
```

5. **Abra um Pull Request**

### Diretrizes de Contribuição

- Mantenha o código limpo e bem documentado
- Adicione testes para novas funcionalidades
- Siga os padrões de código existentes
- Atualize a documentação quando necessário

### Reportar Bugs

Use as [Issues do GitHub](https://github.com/seu-usuario/pump-selection-system/issues) para reportar bugs. Inclua:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente (browser, OS, etc.)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Indústrias Schneider pelos dados técnicos das bombas BC-21
- Comunidade React pela excelente documentação
- Chart.js pela biblioteca de gráficos robusta
- Tailwind CSS pelo framework CSS eficiente

## 📞 Suporte

Se você tiver dúvidas ou precisar de ajuda:

- 📧 Email: seu-email@exemplo.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/pump-selection-system/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/seu-usuario/pump-selection-system/wiki)

---

**Desenvolvido com ❤️ para a comunidade de engenharia**