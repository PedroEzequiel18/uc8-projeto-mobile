import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Transacao } from '../types/Transacao';

import {
  guardarLocal,
  guardarPendente,
  listarLocal,
  listarPendentes,
  removerPendente,
  type Pendente,
} from '../banco/banco';

import {
  carregarTransacoes,
  incluirTransacao,
  ErroDaApi,
  descreverErro,
  type DadosNovaTransacao,
} from '../servicos/transacoes';

export type EstadoTransacoes =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | {
      tipo: 'pronto';
      transacoes: Transacao[];
      pendentes: Pendente[];
      origem: 'nuvem';
    }
  | {
      tipo: 'pronto';
      transacoes: Transacao[];
      pendentes: Pendente[];
      origem: 'aparelho';
      motivo: string;
    };

interface ValorDasTransacoes {
  estado: EstadoTransacoes;
  recarregar: () => void;
  adicionar: (
    nome: string,
    descricao: string,
  ) => Promise<void>;
  buscar: (
    id: number,
  ) => Transacao | undefined;
}

const TransacoesContexto =
  createContext<
    ValorDasTransacoes | undefined
  >(undefined);

export function TransacoesProvedor({
  children,
}: {
  children: ReactNode;
}) {
  const [estado, setEstado] =
    useState<EstadoTransacoes>({
      tipo: 'carregando',
    });

  const [tentativa, setTentativa] =
    useState(0);

  useEffect(() => {
    let cancelado = false;

    setEstado({
      tipo: 'carregando',
    });

    sincronizar()
      .then(() => carregarTransacoes())
      .then(async (transacoes) => {
        const pendentes =
          await listarPendentes();

        if (!cancelado) {
          setEstado({
            tipo: 'pronto',
            transacoes,
            pendentes,
            origem: 'nuvem',
          });
        }

        guardarLocal(
          transacoes,
        ).catch((erro: unknown) => {
          console.warn(
            'Não foi possível guardar no aparelho: ' +
              descreverErro(erro),
          );
        });
      })
      .catch((erro: unknown) => {
        const motivo =
          descreverErro(erro);

        Promise.all([
          listarLocal(),
          listarPendentes(),
        ])
          .then(
            ([guardadas, pendentes]) => {
              if (cancelado) {
                return;
              }

              if (
                guardadas.length > 0 ||
                pendentes.length > 0
              ) {
                setEstado({
                  tipo: 'pronto',
                  transacoes:
                    guardadas,
                  pendentes,
                  origem: 'aparelho',
                  motivo,
                });
              } else {
                setEstado({
                  tipo: 'erro',
                  mensagem: motivo,
                });
              }
            },
          )
          .catch(
            (
              erroLocal: unknown,
            ) => {
              if (!cancelado) {
                setEstado({
                  tipo: 'erro',
                  mensagem:
                    motivo +
                    ' / ' +
                    descreverErro(
                      erroLocal,
                    ),
                });
              }
            },
          );
      });

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function recarregar() {
    setTentativa(
      (atual) => atual + 1,
    );
  }

  async function sincronizar(): Promise<void> {
    for (const pendente of await listarPendentes()) {
      try {
        await incluirTransacao(
          pendente,
        );
      } catch (erro: unknown) {
        if (
          erro instanceof ErroDaApi
        ) {
          console.warn(
            'Pendente descartado pela API: ' +
              descreverErro(
                erro,
              ),
          );
        } else {
          return;
        }
      }

      await removerPendente(
        pendente.id,
      );
    }
  }

  async function adicionar(
    nome: string,
    descricao: string,
  ): Promise<void> {
    const dados: DadosNovaTransacao =
      {
        nome,
        descricao,
        valor: 0,
        id_categoria: 1,
        data: new Date().toLocaleDateString(),
      };

    try {
      const nova =
        await incluirTransacao(
          dados,
        );

      setEstado((atual) =>
        atual.tipo === 'pronto'
          ? {
              ...atual,
              transacoes: [
                ...atual.transacoes,
                nova,
              ],
            }
          : atual,
      );
    } catch (erro: unknown) {
      if (
        erro instanceof ErroDaApi
      ) {
        throw erro;
      }

      const pendente =
        await guardarPendente(
          dados,
        );

      setEstado((atual) =>
        atual.tipo === 'pronto'
          ? {
              ...atual,
              pendentes: [
                ...atual.pendentes,
                pendente,
              ],
            }
          : atual,
      );
    }
  }

  function buscar(
    id: number,
  ): Transacao | undefined {
    return estado.tipo ===
      'pronto'
      ? estado.transacoes.find(
          (transacao) =>
            transacao.id === id,
        )
      : undefined;
  }

  return (
    <TransacoesContexto.Provider
      value={{
        estado,
        recarregar,
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
    useContext(
      TransacoesContexto,
    );

  if (valor === undefined) {
    throw new Error(
      'useTransacoes só funciona dentro de TransacoesProvedor',
    );
  }

  return valor;
}