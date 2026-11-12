import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CabecalhoFinanceiro } from '../components/CabecalhoFinanceiro';

import { BarraGastoMes } from '../components/BarraGastoMes';

import { UltimasTransacoes } from '../components/UltimasTransacoes';

import { useCategorias } from '../contexto/CategoriasContexto';

import { useTransacoes } from '../contexto/TransacoesContexto';

import {
  calcularTotais,
  doMesAtual,
  formatarMoeda,
  nomeDoMesAtual,
} from '../utils/financeiro';

import { cores, espacos, raio } from '../tema/tema';

export default function TelaDashboard() {
  const { estado, recarregar } = useTransacoes();

  const { categorias } = useCategorias();

  const transacoes = estado.tipo === 'pronto' ? estado.transacoes : [];

  const totais = calcularTotais(transacoes, categorias);

  const totaisDoMes = calcularTotais(doMesAtual(transacoes), categorias);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CabecalhoFinanceiro
        totais={totais}
        aoRecalcular={recarregar}
        recalculando={estado.tipo === 'carregando'}
        observacao={
          estado.tipo === 'pronto' && estado.origem === 'aparelho'
            ? 'Sem conexão: mostrando dados do aparelho.'
            : estado.tipo === 'erro'
              ? 'Não foi possível carregar. Toque em Recalcular.'
              : undefined
        }
      />

      <View style={styles.cartaoResumo}>
        <Text style={styles.tituloResumo}>Resumo Mensal</Text>

        <Text style={styles.mes}>{nomeDoMesAtual()}</Text>

        <BarraGastoMes
          receitas={totaisDoMes.receitas}
          despesas={totaisDoMes.despesas}
        />

        <Linha
          rotulo="Receitas do mês"
          valor={formatarMoeda(totaisDoMes.receitas)}
        />

        <Linha
          rotulo="Despesas do mês"
          valor={formatarMoeda(totaisDoMes.despesas)}
        />

        <Linha
          rotulo="Transações registradas"
          valor={String(totaisDoMes.quantidade)}
        />
      </View>

      <UltimasTransacoes transacoes={transacoes} />
    </ScrollView>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.item}>{rotulo}</Text>
      <Text style={styles.itemValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    paddingTop: 50,
    backgroundColor: cores.papel,
    flexGrow: 1,
  },

  cartaoResumo: {
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: espacos.lg,
    marginBottom: espacos.md,
  },

  tituloResumo: {
    color: cores.tinta,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
  },

  mes: {
    color: cores.tintaSuave,
    marginBottom: espacos.md,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    paddingVertical: espacos.sm,
  },

  item: {
    color: cores.tinta,
    fontSize: 15,
  },

  itemValor: {
    color: cores.tinta,
    fontSize: 15,
    fontWeight: '700',
  },
});
