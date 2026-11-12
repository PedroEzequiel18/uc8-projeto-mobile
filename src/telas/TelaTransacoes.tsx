import { StatusBar } from 'expo-status-bar';

import {
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import type { RouteProp } from '@react-navigation/native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RotasDaPilha, RotasDasAbas } from '../navegacao/tipos';

import { CartaoTransacao } from '../components/CartaoTransacao';

import { useTransacoes } from '../contexto/TransacoesContexto';

import { cores, espacos, raio } from '../tema/tema';

import { useFiltros } from '../contexto/FiltrosContexto';

import { categorias } from '../dados/categorias';

import { CabecalhoTela } from '../components/CabecalhoTela';

export default function TelaTransacoes() {
  const { estado, recarregar } = useTransacoes();

  const { filtros, atualizar } = useFiltros();

  const navigation = useNavigation<NativeStackNavigationProp<RotasDaPilha>>();

  const abas = useNavigation<BottomTabNavigationProp<RotasDasAbas>>();

  const route = useRoute<RouteProp<RotasDaPilha, 'Transacoes'>>();

  const { width } = useWindowDimensions();

  const duasColunas = width >= 600;

  const transacoesBase = estado.tipo === 'pronto' ? estado.transacoes : [];

  const transacoes = transacoesBase.filter((transacao) => {
    const categoria = categorias.find((c) => c.id === transacao.id_categoria);

    if (filtros.tipo === 'Receitas' && categoria?.tipo !== 'receita') {
      return false;
    }

    if (filtros.tipo === 'Despesas' && categoria?.tipo === 'receita') {
      return false;
    }

    if (
      filtros.categoria !== 'Todas' &&
      categoria?.nome !== filtros.categoria
    ) {
      return false;
    }

    // Compara só "aaaa-mm-dd" (ignora hora, se houver).
    const dia = transacao.data.slice(0, 10);

    if (filtros.dataInicial && dia < filtros.dataInicial) {
      return false;
    }

    if (filtros.dataFinal && dia > filtros.dataFinal) {
      return false;
    }

    return true;
  });

  // Se o filtro é uma categoria, a nova transação já nasce nela.
  const categoriaFiltrada = categorias.find(
    (c) => c.nome === filtros.categoria,
  );

  const filtroAtivo =
    filtros.tipo !== 'Todos' ||
    filtros.categoria !== 'Todas' ||
    filtros.dataInicial !== '' ||
    filtros.dataFinal !== '';

  // O botão Voltar só aparece se a lista foi aberta a partir de uma categoria.
  const veioDeCategoria =
    route.params?.origem === 'categorias' && categoriaFiltrada !== undefined;

  function voltarParaCategorias() {
    limparFiltros();
    navigation.setParams({ origem: undefined });
    abas.navigate('AbaCategorias');
  }

  function limparFiltros() {
    atualizar({
      tipo: 'Todos',
      categoria: 'Todas',
      dataInicial: '',
      dataFinal: '',
    });
  }

  if (estado.tipo === 'carregando') {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.carregando}>Carregando transações...</Text>
      </View>
    );
  }

  if (estado.tipo === 'erro') {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>
          Não foi possível carregar as transações.
        </Text>

        <Text style={styles.carregando}>{estado.mensagem}</Text>

        <Text style={styles.recarregar} onPress={recarregar}>
          Tentar novamente
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        key={duasColunas ? 'duas' : 'uma'}
        numColumns={duasColunas ? 2 : 1}
        columnWrapperStyle={duasColunas ? styles.linhaDeColunas : undefined}
        contentContainerStyle={styles.container}
        data={transacoes}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            {veioDeCategoria && (
              <Pressable
                accessibilityRole="button"
                onPress={voltarParaCategorias}
                style={styles.voltar}
              >
                <Text style={styles.textoVoltar}>‹ Voltar</Text>
              </Pressable>
            )}

            <CabecalhoTela
              sobretitulo="MOVIMENTAÇÕES"
              titulo="Transações"
              explicacao="Toque numa transação para ver os detalhes, editar ou excluir."
            />

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.botaoNova,
                pressed && styles.pressionado,
              ]}
              onPress={() =>
                navigation.navigate('NovaTransacao', {
                  idCategoria: categoriaFiltrada?.id,
                })
              }
            >
              <Text style={styles.textoBotao}>
                {categoriaFiltrada
                  ? `➕ Nova Transação em ${categoriaFiltrada.nome}`
                  : '➕ Nova Transação'}
              </Text>
            </Pressable>

            {filtroAtivo ? (
              <View style={styles.faixaFiltro}>
                <Text style={styles.textoFiltro}>
                  Filtro ativo: {transacoes.length} de {transacoesBase.length}{' '}
                  transações
                </Text>

                <Pressable
                  accessibilityRole="button"
                  onPress={limparFiltros}
                  style={styles.botaoLimparFiltro}
                >
                  <Text style={styles.textoLimparFiltro}>Limpar</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.contagem}>
                {transacoes.length}{' '}
                {transacoes.length === 1 ? 'transação' : 'transações'}
              </Text>
            )}

            {estado.origem === 'aparelho' && (
              <Text style={styles.aviso}>
                Sem conexão: mostrando dados do aparelho.
              </Text>
            )}

            {estado.pendentes.length > 0 && (
              <Text style={styles.aviso}>
                Pendentes: {estado.pendentes.length}
              </Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.celula}>
            <CartaoTransacao transacao={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {filtroAtivo
              ? 'Nenhuma transação para este filtro.'
              : 'Nenhuma transação cadastrada.'}
          </Text>
        }
      />

      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    paddingTop: 50,
    backgroundColor: cores.papel,
    flexGrow: 1,
  },

  voltar: {
    alignSelf: 'flex-start',
    marginBottom: espacos.sm,
  },

  textoVoltar: {
    color: cores.receita,
    fontWeight: '700',
  },

  botaoNova: {
    backgroundColor: cores.receita,
    borderRadius: raio,
    padding: espacos.md,
    marginBottom: espacos.md,
  },

  pressionado: {
    opacity: 0.8,
  },

  contagem: {
    color: cores.tintaSuave,
    marginBottom: espacos.sm,
  },

  faixaFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.dourado,
    borderRadius: raio,
    paddingVertical: espacos.sm,
    paddingHorizontal: espacos.md,
    marginBottom: espacos.md,
  },

  textoFiltro: {
    flex: 1,
    color: cores.tinta,
  },

  botaoLimparFiltro: {
    borderWidth: 1,
    borderColor: cores.tinta,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  textoLimparFiltro: {
    color: cores.tinta,
    fontWeight: '700',
    fontSize: 12,
  },

  textoBotao: {
    textAlign: 'center',
    fontWeight: '700',
    color: cores.papelCartao,
  },

  aviso: {
    marginBottom: espacos.sm,
    color: '#d97706',
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  carregando: {
    marginTop: espacos.sm,
  },

  erro: {
    color: 'red',
    fontWeight: '700',
  },

  recarregar: {
    marginTop: espacos.md,
    color: 'blue',
  },

  vazio: {
    textAlign: 'center',
    color: cores.tintaSuave,
  },

  linhaDeColunas: {
    gap: espacos.sm,
  },

  celula: {
    flex: 1,
  },
});
