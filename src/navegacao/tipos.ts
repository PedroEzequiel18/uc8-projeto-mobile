import type { NavigatorScreenParams } from '@react-navigation/native';

export type RotasDaPilha = {
  Dashboard: undefined;

  Transacoes: undefined;

  DetalheTransacao: {
    id: number;
  };

  NovaTransacao: undefined;
};

export type RotasDasAbas = {
  AbaInicio:
    NavigatorScreenParams<RotasDaPilha>;

  AbaCategorias: undefined;

  AbaTransacoes:
    NavigatorScreenParams<RotasDaPilha>;

  AbaFiltros: undefined;

  AbaSobre: undefined;
};