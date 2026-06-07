# OrbitX AI — Plataforma Inteligente para Datacenters Sustentáveis

<p align="center">
  <img src="frontend/image/logo (1).png" alt="OrbitX Logo" width="120"/>
</p>

<p align="center">
  <strong>FACULDADE DE INFORMÁTICA E ADMINISTRAÇÃO PAULISTA</strong><br/>
  Análise de Desenvolvimento de Sistemas — Global Solution 2026/1<br/>
  Disciplina: IOT, IOB & Generative IA
</p>

<p align="center">
  <strong>Grupo HyperNova</strong><br/>
  Fabio Henrique de Souza Eduardo · RM 560416<br/>
  Lucas Aurelio de Brito Chicote · RM 559366<br/>
  Gabriel Wu Castro · RM 560210<br/>
  Renato Kenji Sugaki · RM 559810
</p>

---

## Sobre o Projeto

O **OrbitX AI** é uma plataforma futurista de monitoramento inteligente desenvolvida para auxiliar datacenters na redução do consumo energético, prevenção de superaquecimento e diminuição da emissão de carbono.

A solução combina **Inteligência Artificial Generativa**, **dados climáticos espaciais da NASA** e **dashboards em tempo real** para oferecer análises automatizadas e recomendações práticas de otimização da infraestrutura digital.

---

## Funcionalidades

### 1. Monitoramento Inteligente de Datacenters
Monitoramento contínuo de 12 datacenters brasileiros com exibição em tempo real de:
- Temperatura dos servidores (atualização a cada 30s)
- Consumo energético (kWh)
- Emissão de CO₂ (kg)
- PUE — Power Usage Effectiveness
- Status operacional por servidor (Normal / Atenção / Crítico)

### 2. Assistente Inteligente com IA Generativa
Chat interativo com a **Orbit AI**, assistente especializada em datacenters, alimentada pelo modelo **LLaMA 3.3 70B** via Groq API:
- Análise contextual com dados reais do datacenter injetados no prompt
- Histórico de conversa com contexto das últimas 10 mensagens
- Sugestões rápidas para análises comuns
- Recomendações automáticas de otimização

### 3. Monitoramento de Clima Espacial (NASA DONKI)
Integração com a API NASA DONKI para monitoramento de eventos espaciais:
- Erupções solares (Solar Flares) classificadas por intensidade (X, M, C)
- Ejeções de Massa Coronal (CME)
- Cálculo de risco geomagnético: Baixo / Moderado / Alto / Crítico
- Janela de análise: últimos 7 dias

### 4. Mapa de Impacto Geomagnético
Mapa interativo global com Leaflet mostrando:
- Localização dos 12 datacenters monitorados no Brasil
- Marcadores coloridos pelo status do servidor
- Zonas polares com intensidade de risco geomagnético da NASA
- Popup com temperatura e status ao clicar no datacenter

### 5. Dashboard Futurista
Interface visual premium com:
- Modo escuro/claro com persistência (localStorage)
- Glassmorphism e gradientes espaciais
- Indicador "Ao Vivo" com atualização automática
- Design responsivo para desktop e mobile

---

## Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                  React 18 + TypeScript + Vite               │
│                                                              │
│  ┌──────────────────┐        ┌───────────────────────────┐  │
│  │  MetricsDashboard │        │          Chat             │  │
│  │  • KPIs em tempo │        │  • Orbit AI (LLaMA 3.3)   │  │
│  │    real          │        │  • Histórico de mensagens  │  │
│  │  • 12 Servidores │        │  • Sugestões rápidas       │  │
│  │  • Status visual │        └───────────────────────────┘  │
│  ├──────────────────┤                                        │
│  │  SpaceWeather    │        ┌───────────────────────────┐  │
│  │  • NASA DONKI    │        │       DatacenterMap       │  │
│  │  • Risco solar   │        │  • Leaflet + CartoDB      │  │
│  │  • Flares + CMEs │        │  • 12 localidades BR      │  │
│  └──────────────────┘        └───────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (proxy Vite → Flask)
                         │ /api/*
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND                               │
│                     Python · Flask                           │
│                                                              │
│  GET  /api/metrics       → Gera métricas dos servidores     │
│  POST /api/chat          → Chat com Groq API (LLaMA 3.3)    │
│  GET  /api/space-weather → NASA DONKI (FLR + CME)           │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
  ┌─────────────────┐              ┌─────────────────────┐
  │   Groq API      │              │     NASA DONKI API  │
  │ LLaMA 3.3 70B   │              │  api.nasa.gov/DONKI │
  │ (IA Generativa) │              │  Solar Flares + CME │
  └─────────────────┘              └─────────────────────┘
```

### Stack Tecnológica

| Camada       | Tecnologia                                        |
|--------------|---------------------------------------------------|
| Frontend     | React 18 · TypeScript · Vite · Tailwind CSS v3    |
| Backend      | Python 3.10+ · Flask · Flask-CORS · python-dotenv |
| IA Generativa | Groq API · modelo `llama-3.3-70b-versatile`      |
| API Externa  | NASA DONKI (Solar Flares, CME)                    |
| Mapa         | Leaflet + react-leaflet v4 · CartoDB Dark Matter  |
| Estilo       | Glassmorphism · Dark/Light mode · CSS animations  |

---

## Pré-requisitos

- **Python** 3.10 ou superior
- **Node.js** 18 ou superior
- Chave de API da **Groq** (gratuita em [console.groq.com](https://console.groq.com))
- Chave de API da **NASA** (gratuita em [api.nasa.gov](https://api.nasa.gov))

---

## Instruções de Execução

### 1. Clone o repositório

```bash
git clone https://github.com/<seu-usuario>/iaorbitx.git
cd iaorbitx
```

### 2. Configure o Backend

```bash
cd backend

# Crie o ambiente virtual
python -m venv .venv

# Ative o ambiente virtual
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Crie o arquivo .env com o conteúdo abaixo:
```

Crie o arquivo `backend/.env`:

```env
GROQ_API_KEY=sua_chave_groq_aqui
NASA_API_KEY=sua_chave_nasa_aqui
```

```bash
# Inicie o backend
python app.py
```

Backend disponível em: `http://localhost:5000`

### 3. Configure o Frontend

```bash
# Em outro terminal, na raiz do projeto:
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Frontend disponível em: `http://localhost:3000`

> O Vite faz proxy automático de `/api/*` → `http://localhost:5000`, portanto não é necessária nenhuma configuração adicional.

---

## Estrutura do Projeto

```
iaorbitx/
├── backend/
│   ├── app.py                  # API Flask principal
│   ├── requirements.txt        # Dependências Python
│   └── .env                    # Chaves de API (não commitar)
├── frontend/
│   ├── public/
│   │   └── logo.png            # Logo OrbitX
│   ├── src/
│   │   ├── App.tsx             # Layout raiz + tema dark/light
│   │   ├── components/
│   │   │   ├── MetricsDashboard.tsx  # KPIs + lista de servidores
│   │   │   ├── Chat.tsx              # Chat com Orbit AI
│   │   │   ├── SpaceWeather.tsx      # Card + modal NASA DONKI
│   │   │   ├── DatacenterMap.tsx     # Mapa Leaflet interativo
│   │   │   ├── MessageBubble.tsx     # Bolha de mensagem do chat
│   │   │   ├── TypingIndicator.tsx   # Indicador de digitação
│   │   │   └── QuickSuggestions.tsx  # Atalhos de perguntas
│   │   ├── services/
│   │   │   └── api.ts          # Chamadas HTTP ao backend
│   │   ├── data/
│   │   │   └── mockMetrics.ts  # Tipos TypeScript e dados iniciais
│   │   └── index.css           # Estilos globais + glassmorphism
│   ├── index.html              # Entry point + FOUC prevention
│   ├── tailwind.config.js      # Config Tailwind (darkMode: class)
│   └── vite.config.ts          # Config Vite + proxy /api
├── docs/
└── README.md
```

---

## Rotas da API

| Método | Rota                  | Descrição                                        |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/api/metrics`        | Métricas em tempo real dos 12 datacenters        |
| POST   | `/api/chat`           | Envia mensagem ao assistente Orbit AI (LLaMA)    |
| GET    | `/api/space-weather`  | Dados de clima espacial da NASA (últimos 7 dias) |

### POST `/api/chat` — Exemplo

**Request:**
```json
{
  "message": "Quais servidores estão em estado crítico?",
  "history": []
}
```

**Response:**
```json
{
  "response": "Com base nos dados atuais, o servidor Scala Tamboré está em estado crítico com 68°C..."
}
```

### GET `/api/space-weather` — Exemplo de Response

```json
{
  "risk": "alto",
  "flares": [
    { "class": "M2.5", "begin": "2026-06-01T14:00Z", "peak": "2026-06-01T14:30Z", "region": 3712 }
  ],
  "cmes": [],
  "period": "2026-05-30 → 2026-06-06",
  "totalFlares": 3,
  "totalCmes": 1
}
```

---

## Datacenters Monitorados

| Datacenter        | Cidade           | UF |
|-------------------|------------------|----|
| Scala Tamboré     | Barueri          | SP |
| Equinix SP4       | São Paulo        | SP |
| ODATA SP02        | São Paulo        | SP |
| CTMM Itaú         | São Paulo        | SP |
| Equinix RJ1       | Rio de Janeiro   | RJ |
| Ascenty SP1       | Campinas         | SP |
| BR Digital DF1    | Brasília         | DF |
| Copel DC Curitiba | Curitiba         | PR |
| ODATA POA         | Porto Alegre     | RS |
| Tivit BH          | Belo Horizonte   | MG |
| Embratel RJ       | Rio de Janeiro   | RJ |
| NTT Campinas      | Campinas         | SP |

---

## Problemática e Valor Agregado

Os datacenters representam uma das maiores demandas energéticas do setor tecnológico. O crescimento acelerado da computação em nuvem e da IA faz com que servidores consumam enormes quantidades de energia diariamente, gerando:

- Riscos de superaquecimento e falhas críticas
- Altos custos operacionais
- Emissão de carbono significativa

O OrbitX AI resolve essa problemática com uma plataforma moderna que:

- **Reduz consumo de energia** com recomendações automáticas de IA
- **Previne superaquecimento** com monitoramento contínuo e alertas
- **Reduz emissão de carbono** com análises ESG em tempo real
- **Integra dados espaciais** da NASA para antecipar riscos geomagnéticos
- **Democratiza o acesso** a análises preditivas avançadas

---

## Diferenciais

- IA Generativa contextualizada com dados reais do ambiente
- Integração com NASA DONKI para correlação entre clima espacial e infraestrutura
- Mapa global interativo com risco geomagnético em tempo real
- Interface futurista premium estilo SaaS corporativo
- Modo escuro/claro com persistência de preferência
- Atualização automática de métricas a cada 30 segundos
