import { createContext, useContext, useState, ReactNode } from 'react';
export type TipoFiltro = 'Todos' | 'Receitas' | 'Despesas';

export interface Filtros {
  tipo: TipoFiltro;
  categoria: string;
  dataInicial: string;
  dataFinal: string;
}

interface ValorFiltros {
  filtros: Filtros;
  atualizar: (filtros: Filtros) => void;
}

const FiltrosContexto = createContext<ValorFiltros | undefined>(undefined);

export function FiltrosProvedor({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: 'Todos',
    categoria: 'Todas',
    dataInicial: '',
    dataFinal: '',
  });

  return (
    <FiltrosContexto.Provider
      value={{
        filtros,
        atualizar: setFiltros,
      }}
    >
      {children}
    </FiltrosContexto.Provider>
  );
}

export function useFiltros() {
  const contexto = useContext(FiltrosContexto);

  if (!contexto) {
    throw new Error('useFiltros fora do provider');
  }

  return contexto;
}
