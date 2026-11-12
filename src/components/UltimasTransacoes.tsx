import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useCategorias } from '../contexto/CategoriasContexto';

import { useFiltros } from '../contexto/FiltrosContexto';

import type { RotasDasAbas } from '../navegacao/tipos';

import type { Transacao } from '../types/Transacao';

import { dataParaTexto } from '../utils/datas';

import { ehReceita, formatarMoeda } from '../utils/financeiro';

import { cores, espacos, raio } from '../tema/tema';

const QUANTIDADE = 5;

// Da mais recente para a mais antiga (data e, no empate, o id maior).
function maisRecentes(transacoes: Transacao[]): Transacao[] {
  return [...transacoes]
    .sort((a, b) => {
      const porData = b.data.slice(0, 10).localeCompare(a.data.slice(0, 10));

      return porData !== 0 ? porData : b.id - a.id;
    })
    .slice(0, QUANTIDADE);
}

export function UltimasTransacoes({ transacoes }: { transacoes: Transacao[] }) {
  const navigation = useNavigation<BottomTabNavigationProp<RotasDasAbas>>();

  const { atualizar } = useFiltros();

  const { categorias } = useCategorias();

  const recentes = maisRecentes(transacoes);

  // Abre a lista completa, sem filtro sobrando de uma consulta anterior.
  function verTodas() {
    atualizar({
      tipo: 'Todos',
      categoria: 'Todas',
      dataInicial: '',
      dataFinal: '',
    });

    navigation.navigate('AbaTransacoes', { screen: 'Transacoes' });
  }

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo}>Últimas transações</Text>

      {recentes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma transação cadastrada.</Text>
      ) : (
        recentes.map((transacao) => {
          const receita = ehReceita(transacao, categorias);

          return (
            <Pressable
              key={transacao.id}
              accessibilityRole="button"
              accessibilityLabel={`${transacao.nome}, ${formatarMoeda(transacao.valor)}. Toque para ver o detalhe.`}
              onPress={() =>
                navigation.navigate('AbaTransacoes', {
                  screen: 'DetalheTransacao',
                  params: { id: transacao.id },
                })
              }
              style={({ pressed }) => [
                styles.linha,
                pressed && styles.pressionado,
              ]}
            >
              <View style={styles.textos}>
                <Text style={styles.nome} numberOfLines={1}>
                  {transacao.nome}
                </Text>

                <Text style={styles.data}>{dataParaTexto(transacao.data)}</Text>
              </View>

              <Text
                style={[
                  styles.valor,
                  receita ? styles.valorReceita : styles.valorDespesa,
                ]}
              >
                {receita ? '+' : '-'} {formatarMoeda(transacao.valor)}
              </Text>
            </Pressable>
          );
        })
      )}

      <Pressable
        accessibilityRole="button"
        onPress={verTodas}
        style={styles.verTodas}
      >
        <Text style={styles.textoVerTodas}>Ver todas as transações ›</Text>
      </Pressable>
    </View>
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
    marginBottom: espacos.sm,
  },

  vazio: {
    color: cores.tintaSuave,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    paddingVertical: espacos.sm,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  pressionado: {
    backgroundColor: cores.papel,
  },

  textos: {
    flex: 1,
  },

  nome: {
    color: cores.tinta,
    fontSize: 15,
    fontWeight: '600',
  },

  data: {
    color: cores.tintaSuave,
    fontSize: 12,
  },

  valor: {
    fontSize: 15,
    fontWeight: '700',
  },

  valorReceita: {
    color: cores.receita,
  },

  valorDespesa: {
    color: cores.despesa,
  },

  verTodas: {
    alignSelf: 'flex-start',
    marginTop: espacos.sm,
    paddingVertical: espacos.xs,
  },

  textoVerTodas: {
    color: cores.receita,
    fontWeight: '700',
  },
});
