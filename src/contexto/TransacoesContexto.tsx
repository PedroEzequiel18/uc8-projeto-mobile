import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Transacao } from "../types/Transacao";

import {
  guardarLocal,
  guardarPendente,
  listarLocal,
  listarPendentes,
  removerPendente,
  type Pendente,
} from "../banco/banco";

import { ErroDeValidacao, registrarErro } from "../erros/erros";

import {
  carregarTransacoes,
  incluirTransacao,
  removerTransacao,
  ErroDaApi,
  type DadosNovaTransacao,
} from "../servicos/transacoes";
export type EstadoTransacoes =
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | {
      tipo: "pronto";
      transacoes: Transacao[];
      pendentes: Pendente[];
      origem: "nuvem";
    }
  | {
      tipo: "pronto";
      transacoes: Transacao[];
      pendentes: Pendente[];
      origem: "aparelho";
      motivo: string;
    };

interface ValorDasTransacoes {
  estado: EstadoTransacoes;

  recarregar: () => void;

  adicionar: (
    nome: string,
    descricao: string,
    valor: number,
    idCategoria: number,
    data: string,
  ) => Promise<void>;

  remover: (
    id: number,
  ) => Promise<void>;

  buscar: (
    id: number,
  ) => Transacao | undefined;
}

const TransacoesContexto = createContext<ValorDasTransacoes | undefined>(
  undefined,
);

export function TransacoesProvedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoTransacoes>({
    tipo: "carregando",
  });

  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    setEstado({
      tipo: "carregando",
    });

    sincronizar()
      .catch((erro: unknown) => {
        registrarErro("sincronizar", erro);
      })
      .then(() => carregarTransacoes())
      .then(async (transacoes) => {
        const pendentes = await listarPendentes().catch((erro: unknown) => {
          registrarErro("pendentes", erro);
          return [];
        });

        if (!cancelado) {
          setEstado({
            tipo: "pronto",
            transacoes,
            pendentes,
            origem: "nuvem",
          });
        }

        guardarLocal(transacoes).catch((erro: unknown) => {
          registrarErro("guardar no aparelho", erro);
        });
      })
      .catch((erro: unknown) => {
        const motivo = registrarErro("carga", erro).mensagem;

        Promise.all([listarLocal(), listarPendentes()])
          .then(([guardadas, pendentes]) => {
            if (cancelado) {
              return;
            }

            if (guardadas.length > 0 || pendentes.length > 0) {
              setEstado({
                tipo: "pronto",
                transacoes: guardadas,
                pendentes,
                origem: "aparelho",
                motivo,
              });
            } else {
              setEstado({
                tipo: "erro",
                mensagem: motivo,
              });
            }
          })
          .catch((erroLocal: unknown) => {
            if (!cancelado) {
              setEstado({
                tipo: "erro",
                mensagem: registrarErro("leitura do aparelho", erroLocal)
                  .mensagem,
              });
            }
          });
      });

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function recarregar() {
    setTentativa((atual) => atual + 1);
  }

  async function sincronizar(): Promise<void> {
    for (const pendente of await listarPendentes()) {
      try {
        await incluirTransacao(pendente);
      } catch (erro: unknown) {
        if (erro instanceof ErroDaApi) {
          registrarErro("pendente descartado", erro);
        } else {
          return;
        }
      }

      await removerPendente(pendente.id);
    }
  }

  async function adicionar(
    nome: string,
    descricao: string,
    valor: number,
    idCategoria: number,
    data: string,
  ): Promise<void> {
    if (nome.trim() === "") {
      throw new ErroDeValidacao("Informe o nome.");
    }

    const dados: DadosNovaTransacao = {
      nome,
      descricao,
      valor,
      id_categoria: idCategoria,
      data,
    };

    try {
      const nova = await incluirTransacao(dados);

      setEstado((atual) =>
        atual.tipo === "pronto"
          ? {
              ...atual,
              transacoes: [...atual.transacoes, nova],
            }
          : atual,
      );
    } catch (erro: unknown) {
      if (erro instanceof ErroDaApi) {
        throw erro;
      }

      const pendente = await guardarPendente(dados);

      setEstado((atual) =>
        atual.tipo === "pronto"
          ? {
              ...atual,
              pendentes: [...atual.pendentes, pendente],
            }
          : atual,
      );
    }
  }
  async function remover(
  id: number,
): Promise<void> {
  await removerTransacao(id);

  setEstado((atual) =>
    atual.tipo === "pronto"
      ? {
          ...atual,
          transacoes: atual.transacoes.filter(
            (t) => t.id !== id,
          ),
        }
      : atual,
  );
}

function buscar(id: number): Transacao | undefined {
  return estado.tipo === "pronto"
    ? estado.transacoes.find(
        (transacao) => transacao.id === id,
      )
    : undefined;
}

  return (
    <TransacoesContexto.Provider
      value={{
        estado,
        recarregar,
        adicionar,
        remover,
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
    throw new Error(
      "useTransacoes só funciona dentro de TransacoesProvedor",
    );
  }

  return valor;
}