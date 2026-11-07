import { useState } from 'react';

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { categorias } from '../dados/categorias';

import type { Transacao } from '../types/Transacao';

import { doMesAtual, ehReceita, formatarMoeda } from '../utils/financeiro';

import { cores, espacos, raio } from '../tema/tema';

type Periodo = 'mes' | 'tudo';

interface Fatia {
  nome: string;
  total: number;
  quantidade: number;
}

// Soma as despesas por categoria, da maior para a menor.
function agruparDespesas(transacoes: Transacao[]): Fatia[] {
  const porCategoria = new Map<number, Fatia>();

  for (const transacao of transacoes) {
    if (ehReceita(transacao)) {
      continue;
    }

    const atual = porCategoria.get(transacao.id_categoria) ?? {
      nome:
        categorias.find((c) => c.id === transacao.id_categoria)?.nome ??
        `Categoria ${transacao.id_categoria}`,
      total: 0,
      quantidade: 0,
    };

    atual.total += transacao.valor;
    atual.quantidade += 1;

    porCategoria.set(transacao.id_categoria, atual);
  }

  return [...porCategoria.values()].sort((a, b) => b.total - a.total);
}

export function GraficoDespesas({ transacoes }: { transacoes: Transacao[] }) {
  const [periodo, setPeriodo] = useState<Periodo>('mes');

  const [selecionada, setSelecionada] = useState<string | undefined>();

  const fatias = agruparDespesas(
    periodo === 'mes' ? doMesAtual(transacoes) : transacoes,
  );

  const totalGeral = fatias.reduce((soma, f) => soma + f.total, 0);

  const maior = fatias[0]?.total ?? 0;

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo}>Despesas por categoria</Text>

      <View style={styles.periodos}>
        <ChipPeriodo
          texto="Este mês"
          ativo={periodo === 'mes'}
          aoPressionar={() => {
            setPeriodo('mes');
            setSelecionada(undefined);
          }}
        />

        <ChipPeriodo
          texto="Tudo"
          ativo={periodo === 'tudo'}
          aoPressionar={() => {
            setPeriodo('tudo');
            setSelecionada(undefined);
          }}
        />
      </View>

      {fatias.length === 0 ? (
        <Text style={styles.vazio}>
          Nenhuma despesa {periodo === 'mes' ? 'neste mês' : 'registrada'}.
        </Text>
      ) : (
        <>
          <Text style={styles.total}>Total: {formatarMoeda(totalGeral)}</Text>

          {fatias.map((fatia) => {
            const percentual =
              totalGeral > 0 ? (fatia.total / totalGeral) * 100 : 0;
            const largura = maior > 0 ? (fatia.total / maior) * 100 : 0;
            const ativa = selecionada === fatia.nome;

            return (
              <Pressable
                key={fatia.nome}
                accessibilityRole="button"
                accessibilityLabel={`${fatia.nome}: ${formatarMoeda(fatia.total)}, ${percentual.toFixed(0)}% das despesas, ${fatia.quantidade} transações`}
                onPress={() => setSelecionada(ativa ? undefined : fatia.nome)}
                style={[styles.linha, ativa && styles.linhaAtiva]}
              >
                <View style={styles.cabecalhoLinha}>
                  <Text style={styles.nome} numberOfLines={1}>
                    {fatia.nome}
                  </Text>

                  <Text style={styles.valor}>{formatarMoeda(fatia.total)}</Text>
                </View>

                <View style={styles.trilho}>
                  <View
                    style={[
                      styles.barra,
                      { width: `${Math.max(largura, 2)}%` },
                      selecionada !== undefined &&
                        !ativa &&
                        styles.barraApagada,
                    ]}
                  />
                </View>

                {ativa && (
                  <Text style={styles.detalhe}>
                    {percentual.toFixed(1).replace('.', ',')}% das despesas ·{' '}
                    {fatia.quantidade}{' '}
                    {fatia.quantidade === 1 ? 'transação' : 'transações'}
                  </Text>
                )}
              </Pressable>
            );
          })}

          <Text style={styles.dica}>
            Toque numa barra para ver os detalhes.
          </Text>
        </>
      )}
    </View>
  );
}

function ChipPeriodo({
  texto,
  ativo,
  aoPressionar,
}: {
  texto: string;
  ativo: boolean;
  aoPressionar: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      onPress={aoPressionar}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: espacos.lg,
    marginBottom: espacos.md,
  },

  titulo: {
    color: cores.tinta,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
  },

  periodos: {
    flexDirection: 'row',
    gap: espacos.sm,
    marginTop: espacos.sm,
    marginBottom: espacos.md,
  },

  chip: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  chipAtivo: {
    backgroundColor: cores.tinta,
    borderColor: cores.tinta,
  },

  textoChip: {
    color: cores.tinta,
    fontSize: 12,
    fontWeight: '600',
  },

  textoChipAtivo: {
    color: cores.papelCartao,
  },

  total: {
    color: cores.tintaSuave,
    marginBottom: espacos.sm,
  },

  vazio: {
    color: cores.tintaSuave,
  },

  linha: {
    paddingVertical: espacos.sm,
    paddingHorizontal: espacos.xs,
    borderRadius: 8,
  },

  linhaAtiva: {
    backgroundColor: cores.despesaFundo,
  },

  cabecalhoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espacos.sm,
    marginBottom: espacos.xs,
  },

  nome: {
    flex: 1,
    color: cores.tinta,
    fontSize: 14,
  },

  valor: {
    color: cores.tinta,
    fontSize: 14,
    fontWeight: '700',
  },

  trilho: {
    height: 10,
    backgroundColor: cores.papel,
    borderRadius: 4,
    overflow: 'hidden',
  },

  barra: {
    height: '100%',
    backgroundColor: cores.despesa,
    // Ponta arredondada só na extremidade do dado.
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  barraApagada: {
    opacity: 0.35,
  },

  detalhe: {
    color: cores.tintaSuave,
    fontSize: 12,
    marginTop: espacos.xs,
  },

  dica: {
    color: cores.tintaSuave,
    fontSize: 12,
    marginTop: espacos.sm,
  },
});
