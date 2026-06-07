export interface Server {
  id: string;
  temp: number;
  status: "normal" | "atenção" | "critico";
}

export interface Metrics {
  temperature: number;
  energyUsage: number;
  carbonEmission: number;
  pue: number;
  alerts: number;
  servers: Server[];
}

export const initialMetrics: Metrics = {
  temperature: 42.5,
  energyUsage: 1250,
  carbonEmission: 87.3,
  pue: 1.4,
  alerts: 2,
  servers: [
    { id: "Scala Tamboré",     temp: 68, status: "critico"  },
    { id: "Equinix SP4",       temp: 45, status: "normal"   },
    { id: "ODATA SP02",        temp: 71, status: "atenção"  },
    { id: "CTMM Itaú",         temp: 38, status: "normal"   },
    { id: "Equinix RJ1",       temp: 52, status: "normal"   },
    { id: "Ascenty SP1",       temp: 41, status: "normal"   },
    { id: "BR Digital DF1",    temp: 62, status: "atenção"  },
    { id: "Copel DC Curitiba", temp: 35, status: "normal"   },
    { id: "ODATA POA",         temp: 43, status: "normal"   },
    { id: "Tivit BH",          temp: 58, status: "atenção"  },
    { id: "Embratel RJ",       temp: 48, status: "normal"   },
    { id: "NTT Campinas",      temp: 44, status: "normal"   },
  ],
};
