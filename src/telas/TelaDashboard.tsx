import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import { useTransacoes } from '../contexto/TransacoesContexto';
import { categorias } from '../dados/categorias';

import {
  cores,
  espacos,
  raio,
} from '../tema/tema';

export default function TelaDashboard() {
  const { estado } =
    useTransacoes();

  const transacoes =
    estado.tipo === 'pronto'
      ? estado.transacoes
      : [];

  const receitas =
    transacoes
      .filter((transacao) => {
        const categoria =
          categorias.find(
            (c) =>
              c.id ===
              transacao.id_categoria,
          );

        return (
          categoria?.tipo ===
          'receita'
        );
      })
      .reduce(
        (soma, transacao) =>
          soma + transacao.valor,
        0,
      );

  const despesas =
    transacoes
      .filter((transacao) => {
        const categoria =
          categorias.find(
            (c) =>
              c.id ===
              transacao.id_categoria,
          );

        return (
          categoria?.tipo === 'fixa' ||
categoria?.tipo === 'variavel'
        );
      })
      .reduce(
        (soma, transacao) =>
          soma + transacao.valor,
        0,
      );

  const saldo =
    receitas - despesas;

  const movimentado =
    receitas + despesas;

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        Gestor de Fluxo de Caixa
      </Text>

      <View style={styles.cartaoSaldo}>
        <Text style={styles.rotulo}>
          SALDO APURADO
        </Text>

        <Text style={styles.valorSaldo}>
          R$ {saldo.toFixed(2)}
        </Text>
      </View>

      <View style={styles.resumo}>
        <View style={styles.cardReceita}>
          <Text style={styles.rotulo}>
            RECEITAS
          </Text>

          <Text
            style={styles.valorReceita}
          >
            R$ {receitas.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cardDespesa}>
          <Text style={styles.rotulo}>
            DESPESAS
          </Text>

          <Text
            style={styles.valorDespesa}
          >
            R$ {despesas.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.cartaoResumo}>
        <Text
          style={styles.tituloResumo}
        >
          Resumo Mensal
        </Text>

        <Text style={styles.item}>
          Receitas do mês:
          {' '}
          R$ {receitas.toFixed(2)}
        </Text>

        <Text style={styles.item}>
          Despesas do mês:
          {' '}
          R$ {despesas.toFixed(2)}
        </Text>

        <Text style={styles.item}>
          Total movimentado:
          {' '}
          R$ {movimentado.toFixed(2)}
        </Text>

        <Text style={styles.item}>
          Transações registradas:
          {' '}
          {transacoes.length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    paddingTop: 50,
    backgroundColor:
      cores.papel,
    flexGrow: 1,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: espacos.lg,
  },

  cartaoSaldo: {
    backgroundColor:
      cores.papelCartao,

    borderWidth: 1,
    borderColor:
      cores.borda,

    borderRadius: raio,

    padding: espacos.lg,

    marginBottom:
      espacos.md,

    alignItems: 'center',
  },

  rotulo: {
    color: cores.tintaSuave,
    fontSize: 12,
    fontWeight: '600',
  },

  valorSaldo: {
    color: cores.tinta,
    fontSize: 28,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  resumo: {
    flexDirection: 'row',
    gap: espacos.sm,
    marginBottom: espacos.md,
  },

  cardReceita: {
    flex: 1,
    backgroundColor:
      cores.receitaFundo,

    borderRadius: raio,

    padding: espacos.md,
  },

  cardDespesa: {
    flex: 1,
    backgroundColor:
      cores.despesaFundo,

    borderRadius: raio,

    padding: espacos.md,
  },

  valorReceita: {
    color: cores.receita,
    fontSize: 20,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  valorDespesa: {
    color: cores.despesa,
    fontSize: 20,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  cartaoResumo: {
    backgroundColor:
      cores.papelCartao,

    borderWidth: 1,

    borderColor:
      cores.borda,

    borderRadius: raio,

    padding: espacos.lg,
  },

  tituloResumo: {
    color: cores.tinta,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: espacos.md,
  },

  item: {
    color: cores.tinta,
    fontSize: 16,
    marginBottom: espacos.sm,
  },
});