import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos } from '../tema/tema';

interface BarraGastoMesProps {
  receitas: number;
  despesas: number;
}

// Mostra quanto da receita do mês já foi gasto (fica dentro do Resumo Mensal).
export function BarraGastoMes({ receitas, despesas }: BarraGastoMesProps) {
  const semReceita = receitas <= 0;

  const percentual = semReceita ? 0 : (despesas / receitas) * 100;

  const cor =
    percentual >= 100
      ? cores.despesa
      : percentual >= 70
        ? cores.dourado
        : cores.receita;

  let frase = 'Nenhuma movimentação neste mês.';

  if (semReceita && despesas > 0) {
    frase = 'Ainda não há receita lançada neste mês.';
  } else if (!semReceita && percentual > 100) {
    frase = 'Você gastou mais do que entrou neste mês.';
  } else if (!semReceita) {
    frase = 'do que entrou neste mês já foi gasto.';
  }

  return (
    <View style={styles.container}>
      {!semReceita && (
        <Text style={[styles.numero, { color: cor }]}>
          {percentual.toFixed(0)}%
        </Text>
      )}

      <View style={styles.trilho}>
        <View
          style={[
            styles.barra,
            {
              width: `${Math.min(percentual, 100)}%`,
              backgroundColor: cor,
            },
          ]}
        />
      </View>

      <Text style={styles.frase}>{frase}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },

  numero: {
    fontSize: 40,
    fontWeight: '700',
  },

  trilho: {
    height: 12,
    backgroundColor: cores.papel,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: espacos.sm,
  },

  barra: {
    height: '100%',
    borderRadius: 6,
  },

  frase: {
    color: cores.tintaSuave,
    marginTop: espacos.sm,
  },
});
