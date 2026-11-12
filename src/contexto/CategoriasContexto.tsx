import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { guardarCategoriasLocal, listarCategoriasLocal } from '../banco/banco';

import { categoriasPadrao } from '../dados/categorias';

import { ErroDeValidacao, registrarErro } from '../erros/erros';

import { carregarCategorias, incluirCategoria } from '../servicos/categorias';

import { ErroDaApi } from '../servicos/transacoes';

import type { Categoria } from '../types/Categoria';

interface ValorDasCategorias {
  categorias: Categoria[];
  criar: (nome: string, tipo: Categoria['tipo']) => Promise<void>;
}

const CategoriasContexto = createContext<ValorDasCategorias | undefined>(
  undefined,
);

const MENSAGEM_REPETIDA = 'Já existe uma categoria com esse nome.';

export function CategoriasProvedor({ children }: { children: ReactNode }) {
  // Começa com as categorias de fábrica: o app nunca fica sem lista.
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasPadrao);

  useEffect(() => {
    let cancelado = false;

    carregarCategorias()
      .then((lista) => {
        if (cancelado || lista.length === 0) {
          return;
        }

        setCategorias(lista);

        guardarCategoriasLocal(lista).catch((erro: unknown) => {
          registrarErro('categorias no aparelho', erro);
        });
      })
      .catch((erro: unknown) => {
        registrarErro('categorias', erro);

        // Sem a nuvem: usa a cópia guardada no aparelho, se houver.
        listarCategoriasLocal()
          .then((guardadas) => {
            if (!cancelado && guardadas.length > 0) {
              setCategorias(guardadas);
            }
          })
          .catch((erroLocal: unknown) => {
            registrarErro('categorias no aparelho', erroLocal);
          });
      });

    return () => {
      cancelado = true;
    };
  }, []);

  async function criar(nome: string, tipo: Categoria['tipo']): Promise<void> {
    const limpo = nome.trim();

    if (limpo === '') {
      throw new ErroDeValidacao('Informe o nome da categoria.');
    }

    if (
      categorias.some(
        (categoria) => categoria.nome.toLowerCase() === limpo.toLowerCase(),
      )
    ) {
      throw new ErroDeValidacao(MENSAGEM_REPETIDA);
    }

    try {
      const nova = await incluirCategoria({ nome: limpo, tipo });

      const proximas = [...categorias, nova];

      setCategorias(proximas);

      guardarCategoriasLocal(proximas).catch((erro: unknown) => {
        registrarErro('categorias no aparelho', erro);
      });
    } catch (erro: unknown) {
      // 409: outro aparelho já criou uma categoria com esse nome.
      if (erro instanceof ErroDaApi && erro.status === 409) {
        throw new ErroDeValidacao(MENSAGEM_REPETIDA);
      }

      throw erro;
    }
  }

  return (
    <CategoriasContexto.Provider value={{ categorias, criar }}>
      {children}
    </CategoriasContexto.Provider>
  );
}

export function useCategorias(): ValorDasCategorias {
  const valor = useContext(CategoriasContexto);

  if (valor === undefined) {
    throw new Error('useCategorias só funciona dentro de CategoriasProvedor');
  }

  return valor;
}
