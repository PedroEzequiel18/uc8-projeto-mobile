import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Botao } from './Botao';

import type { RotasDaPilha } from '../navegacao/tipos';
import type { Transacao } from '../types/Transacao';
import {
  cores,
  espacos,
  raio,
} from '../tema/tema';

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
    <View style={estilos.cartao}>
      <Text style={estilos.titulo}>
        {transacao.nome}
      </Text>

      <Text style={estilos.descricao}>
        {transacao.descricao}
      </Text>

      <Text style={estilos.valor}>
        Valor: R$ {transacao.valor}
      </Text>

      <Text style={estilos.data}>
        Data: {transacao.data}
      </Text>

      <View style={estilos.acoes}>
        <Botao
          titulo="Detalhes"
          onPress={() =>
            navigation.navigate(
              'DetalheTransacao',
              {
                id: transacao.id,
              },
            )
          }
        />
      </View>

      {destaque && (
        <Text style={estilos.destaque}>
          Destaque
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.papelCartao,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio,
    padding: espacos.md,
    marginBottom: espacos.sm,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 18,
    fontWeight: 'bold',
  },

  descricao: {
    color: cores.tintaSuave,
    marginTop: espacos.sm,
  },

  valor: {
    color: cores.tinta,
    marginTop: espacos.sm,
    fontWeight: '600',
  },

  data: {
    color: cores.tintaSuave,
    marginTop: espacos.xs,
  },

  acoes: {
    flexDirection: 'row',
    marginTop: espacos.md,
  },

  destaque: {
    color: cores.dourado,
    fontWeight: 'bold',
    marginTop: espacos.sm,
  },
});