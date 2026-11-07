import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaTransacoes from '../telas/TelaTransacoes';
import TelaDetalheTransacao from '../telas/TelaDetalheTransacao';
import TelaNovaTransacao from '../telas/TelaNovaTransacao';
import TelaEditarTransacao from '../telas/TelaEditarTransacao';

import type { RotasDaPilha } from './tipos';

const Stack = createNativeStackNavigator<RotasDaPilha>();

export function PilhaTransacoes() {
  return (
    <Stack.Navigator initialRouteName="Transacoes">
      <Stack.Screen
        name="Transacoes"
        component={TelaTransacoes}
        options={{
          title: 'Transações',
          // A tela tem cabeçalho próprio (igual ao de Categorias).
          headerShown: false,
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

      <Stack.Screen
        name="EditarTransacao"
        component={TelaEditarTransacao}
        options={{
          title: 'Editar Transação',
        }}
      />
    </Stack.Navigator>
  );
}
