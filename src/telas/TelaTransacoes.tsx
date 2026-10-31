import { useEffect, useState } from 'react';
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

import type { Transacao } from '../types/Transacao';
import { cores, espacos } from '../tema/tema';

function carregarTransacoes(): Promise<Transacao[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          nome: 'Salário',
          descricao: 'Mensal de pagamento',
          valor: 3500,
          id_categoria: 1,
          data: '18/09/2026',
        },
        {
          id: 2,
          nome: 'Internet',
          descricao: 'Conta mensal',
          valor: 120,
          id_categoria: 2,
          data: '18/09/2026',
        },
      ]);
    }, 1000);
  });
}

export default function TelaTransacoes() {
  const [transacoes, setTransacoes] =
    useState<Transacao[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const { width } = useWindowDimensions();

  const duasColunas = width >= 600;

  useEffect(() => {
    carregarTransacoes().then((dados) => {
      setTransacoes(dados);
      setCarregando(false);
    });
  }, []);

  function adicionarTransacao(
    nome: string,
    descricao: string,
  ): void {
    const novaTransacao: Transacao = {
      id:
        Math.max(
          0,
          ...transacoes.map(
            (transacao) => transacao.id,
          ),
        ) + 1,
      nome,
      descricao,
      valor: 0,
      id_categoria: 1,
      data: new Date().toLocaleDateString(),
    };

    setTransacoes([
      ...transacoes,
      novaTransacao,
    ]);
  }

  if (carregando) {
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
        data={transacoes}
        keyExtractor={(item) =>
          String(item.id)
        }
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>
              Gestor de Fluxo de Caixa
            </Text>

            <FormularioTransacao
              aoCriar={adicionarTransacao}
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