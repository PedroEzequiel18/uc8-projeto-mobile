import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTransacoes } from '../contexto/TransacoesContexto';

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

  const { buscar } = useTransacoes();

  const transacao = buscar(id);

  if (transacao === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          Transação não encontrada
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {transacao.nome}
      </Text>

      <Text style={styles.texto}>
        {transacao.descricao}
      </Text>

      <Text style={styles.texto}>
        Valor: R$ {transacao.valor}
      </Text>

      <Text style={styles.texto}>
        Data: {transacao.data}
      </Text>

      <Text style={styles.texto}>
        Categoria: {transacao.id_categoria}
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

  texto: {
    color: cores.tintaSuave,
    marginBottom: espacos.sm,
  },
});