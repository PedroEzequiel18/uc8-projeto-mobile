import type { NavigatorScreenParams } from '@react-navigation/native';

export type RotasDaPilha = {
  Dashboard: undefined;

  // origem: 'categorias' quando a lista foi aberta ao tocar numa categoria.
  Transacoes:
    | {
        origem?: 'categorias';
      }
    | undefined;

  DetalheTransacao: {
    id: number;
  };

  // idCategoria: abre o formulário com a categoria já escolhida.
  NovaTransacao:
    | {
        idCategoria?: number;
      }
    | undefined;

  EditarTransacao: {
    id: number;
  };
};

export type RotasDasAbas = {
  AbaInicio: NavigatorScreenParams<RotasDaPilha>;

  AbaCategorias: undefined;

  AbaTransacoes: NavigatorScreenParams<RotasDaPilha>;

  AbaFiltros: undefined;

  AbaSobre: undefined;
};
