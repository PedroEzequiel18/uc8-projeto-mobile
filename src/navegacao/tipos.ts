import type { NavigatorScreenParams } from '@react-navigation/native';

export type RotasDaPilha = {
  Transacoes: undefined;
  DetalheTransacao: {
    id: number;
  };
  NovaTransacao: undefined;
};

export type RotasDasAbas = {
  AbaTransacoes: NavigatorScreenParams<RotasDaPilha>;
  AbaSobre: undefined;
};
