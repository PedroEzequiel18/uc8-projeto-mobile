import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';

import type { RotasDaPilha } from '../navegacao/tipos';
import type { Transacao } from '../types/Transacao';

interface CartaoTransacaoProps {
  transacao: Transacao;
  destaque?: boolean;
}

export function CartaoTransacao({
  transacao,
  destaque = false,
}: CartaoTransacaoProps) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RotasDaPilha>
    >();

  return (
    <View>
      <Text>{transacao.nome}</Text>

      <Button
        title="MOSTRAR DETALHES"
        onPress={() =>
          navigation.navigate(
            'DetalheTransacao',
            {
              id: transacao.id,
            }
          )
        }
      />

      <Text>{transacao.descricao}</Text>

      <Text>
        Valor: R$ {transacao.valor}
      </Text>

      <Text>
        Data: {transacao.data}
      </Text>

      {destaque && (
        <Text>Destaque</Text>
      )}
    </View>
  );
}