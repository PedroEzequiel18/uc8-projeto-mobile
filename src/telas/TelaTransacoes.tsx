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
  const { estado, adicionar } =
    useTransacoes();

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
            Nenhuma transação cadastrada.
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
  },

  carregando: {
    marginTop: espacos.sm,
    color: cores.tinta,
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