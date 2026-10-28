import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaTransacoes from '../telas/TelaTransacoes';
import TelaDetalheTransacao from '../telas/TelaDetalheTransacao';
import TelaNovaTransacao from '../telas/TelaNovaTransacao';

import type { RotasDaPilha } from './tipos';

const Stack =
  createNativeStackNavigator<RotasDaPilha>();

export function PilhaTransacoes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Transacoes"
        component={TelaTransacoes}
        options={{
          title: 'Transações',
        }}
      />

      <Stack.Screen
        name="DetalheTransacao"
        component={TelaDetalheTransacao}
        options={{
          title: 'Detalhes',
        }}
      />

      <Stack.Screen
        name="NovaTransacao"
        component={TelaNovaTransacao}
        options={{
          title: 'Nova Transação',
        }}
      />
    </Stack.Navigator>
  );
}