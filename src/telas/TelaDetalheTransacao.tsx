import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RotasDaPilha } from '../navegacao/tipos';

type TelaDetalheTransacaoProps =
  NativeStackScreenProps<
    RotasDaPilha,
    'DetalheTransacao'
  >;

export default function TelaDetalheTransacao({
  route,
}: TelaDetalheTransacaoProps) {
  const { id } = route.params;

  return (
    <View>
      <Text>Detalhe da Transação</Text>

      <Text>ID: {id}</Text>
    </View>
  );
}