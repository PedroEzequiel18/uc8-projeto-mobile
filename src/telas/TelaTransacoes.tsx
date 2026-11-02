import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  useWindowDimensions,
} from 'react-native';

import { CartaoTransacao } from '../components/CartaoTransacao';
import { FormularioTransacao } from '../components/FormularioTransacao';

import { useTransacoes } from '../contexto/TransacoesContexto';

import { cores, espacos } from '../tema/tema';

export default function TelaTransacoes() {
  const {
    estado,
    adicionar,
    recarregar,
  } = useTransacoes();

  const { width } =
    useWindowDimensions();

  const duasColunas =
    width >= 600;

  if (estado.tipo === 'carregando') {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.carregando}>
          Carregando transações...
        </Text>
      </View>
    );
  }

  if (estado.tipo === 'erro') {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>
          Não foi possível carregar as
          transações.
        </Text>

        <Text style={styles.carregando}>
          {estado.mensagem}
        </Text>

        <Text
          style={styles.recarregar}
          onPress={recarregar}
        >
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
        columnWrapperStyle={
          duasColunas
            ? styles.linhaDeColunas
            : undefined
        }
        contentContainerStyle={
          styles.container
        }
        data={estado.transacoes}
        keyExtractor={(item) =>
          String(item.id)
        }
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>
              Gestor de Fluxo de Caixa
            </Text>

            {estado.origem ===
              'aparelho' && (
              <Text style={styles.aviso}>
                Sem conexão: mostrando
                dados guardados no
                aparelho ({estado.motivo})
              </Text>
            )}

            {estado.pendentes.length >
              0 && (
              <Text style={styles.aviso}>
                A enviar (
                {estado.pendentes.length})
              </Text>
            )}

            <FormularioTransacao
              aoCriar={adicionar}
            />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.celula}>
            <CartaoTransacao
              transacao={item}
              destaque={item.id === 1}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhuma transação
            cadastrada.
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
    gap: espacos.md,
    backgroundColor: cores.papel,
    flexGrow: 1,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: espacos.lg,
    marginBottom: espacos.md,
    color: cores.tinta,
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.papel,
    padding: espacos.md,
  },

  carregando: {
    marginTop: espacos.sm,
    color: cores.tinta,
    textAlign: 'center',
  },

  erro: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: espacos.sm,
  },

  recarregar: {
    marginTop: espacos.md,
    color: 'blue',
    fontWeight: 'bold',
  },

  aviso: {
    marginBottom: espacos.sm,
    color: '#d97706',
    fontWeight: '600',
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