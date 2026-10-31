import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Transacao } from '../types/Transacao';

export type EstadoTransacoes =
  | { tipo: 'carregando' }
  | {
      tipo: 'pronto';
      transacoes: Transacao[];
    };

interface ValorDasTransacoes {
  estado: EstadoTransacoes;

  adicionar: (
    nome: string,
    descricao: string,
  ) => void;

  buscar: (
    id: number,
  ) => Transacao | undefined;
}

const TransacoesContexto =
  createContext<
    ValorDasTransacoes | undefined
  >(undefined);

function carregarTransacoes(): Promise<
  Transacao[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          nome: 'Salário',
          descricao: 'Mensal de pagamento',
          valor: 3500,
          id_categoria: 1,
          data: '18/09/2026',
        },
        {
          id: 2,
          nome: 'Internet',
          descricao: 'Conta mensal',
          valor: 120,
          id_categoria: 2,
          data: '18/09/2026',
        },
      ]);
    }, 1000);
  });
}

export function TransacoesProvedor({
  children,
}: {
  children: ReactNode;
}) {
  const [estado, setEstado] =
    useState<EstadoTransacoes>({
      tipo: 'carregando',
    });

  useEffect(() => {
    carregarTransacoes().then(
      (transacoes) => {
        setEstado({
          tipo: 'pronto',
          transacoes,
        });
      },
    );
  }, []);

  function adicionar(
    nome: string,
    descricao: string,
  ) {
    setEstado((atual) => {
      if (atual.tipo !== 'pronto') {
        return atual;
      }

      const novaTransacao: Transacao = {
        id:
          Math.max(
            0,
            ...atual.transacoes.map(
              (transacao) =>
                transacao.id,
            ),
          ) + 1,

        nome,
        descricao,
        valor: 0,
        id_categoria: 1,
        data: new Date().toLocaleDateString(),
      };

      return {
        tipo: 'pronto',
        transacoes: [
          ...atual.transacoes,
          novaTransacao,
        ],
      };
    });
  }

  function buscar(id: number) {
    if (estado.tipo !== 'pronto') {
      return undefined;
    }

    return estado.transacoes.find(
      (transacao) =>
        transacao.id === id,
    );
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
  const valor =
    useContext(TransacoesContexto);

  if (valor === undefined) {
    throw new Error(
      'useTransacoes só funciona dentro de TransacoesProvedor',
    );
  }

  return valor;
}