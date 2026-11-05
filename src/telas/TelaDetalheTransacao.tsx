import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTransacoes } from '../contexto/TransacoesContexto';

import {
  cores,
  espacos,
  raio,
} from '../tema/tema';

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
      <View style={styles.cartao}>
        <Text style={styles.titulo}>
          {transacao.nome}
        </Text>

        <Text style={styles.descricao}>
          {transacao.descricao}
        </Text>

        <View style={styles.blocoValor}>
          <Text style={styles.rotulo}>
            VALOR
          </Text>

          <Text style={styles.valor}>
            R$ {transacao.valor.toFixed(2)}
          </Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>
            DATA
          </Text>

          <Text style={styles.texto}>
            {transacao.data}
          </Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>
            CATEGORIA
          </Text>

          <Text style={styles.texto}>
            {transacao.id_categoria}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.papel,
    padding: espacos.md,
  },

  cartao: {
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: espacos.lg,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 24,
    fontWeight: '700',
  },

  descricao: {
    color: cores.tintaSuave,
    marginTop: espacos.sm,
    marginBottom: espacos.lg,
  },

  blocoValor: {
    marginBottom: espacos.lg,
  },

  rotulo: {
    color: cores.tintaSuave,
    fontSize: 12,
    fontWeight: '600',
  },

  valor: {
    color: cores.receita,
    fontSize: 32,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  linha: {
    marginTop: espacos.md,
  },

  texto: {
    color: cores.tinta,
    fontSize: 16,
    marginTop: espacos.xs,
  },
});