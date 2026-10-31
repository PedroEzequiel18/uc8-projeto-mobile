import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { cores, espacos } from '../tema/tema';
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
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Detalhe da Transação
      </Text>

      <Text style={styles.id}>
        ID: {id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.papel,
    padding: espacos.md,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: espacos.md,
  },

  id: {
    color: cores.tintaSuave,
    fontSize: 16,
  },
});