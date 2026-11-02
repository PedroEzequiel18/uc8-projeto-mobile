import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Transacao } from "../types/Transacao";

import { carregarTransacoes, incluirTransacao } from "../servicos/transacoes";

export type EstadoTransacoes =
  | { tipo: "carregando" }
  | {
      tipo: "pronto";
      transacoes: Transacao[];
    };

interface ValorDasTransacoes {
  estado: EstadoTransacoes;

  adicionar: (nome: string, descricao: string) => Promise<void>;

  buscar: (id: number) => Transacao | undefined;
}

const TransacoesContexto = createContext<ValorDasTransacoes | undefined>(
  undefined,
);

export function TransacoesProvedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoTransacoes>({
    tipo: "carregando",
  });

  useEffect(() => {
    carregarTransacoes().then((transacoes) => {
      setEstado({
        tipo: "pronto",
        transacoes,
      });
    });
  }, []);

  async function adicionar(nome: string, descricao: string) {
    const novaTransacao = await incluirTransacao({
      nome,
      descricao,
      valor: 0,
      id_categoria: 1,
      data: new Date().toLocaleDateString(),
    });
    setEstado((atual) => {
      if (atual.tipo !== "pronto") {
        return atual;
      }

      return {
        tipo: "pronto",
        transacoes: [...atual.transacoes, novaTransacao],
      };
    });
  }

  function buscar(id: number) {
    if (estado.tipo !== "pronto") {
      return undefined;
    }

    return estado.transacoes.find((transacao) => transacao.id === id);
  }

  return (
    <TransacoesContexto.Provider
      value={{
        estado,
        adicionar,
        buscar,
      }}
    >
      {children}
    </TransacoesContexto.Provider>
  );
}

export function useTransacoes() {
  const valor = useContext(TransacoesContexto);

  if (valor === undefined) {
    throw new Error("useTransacoes só funciona dentro de TransacoesProvedor");
  }

  return valor;
}
