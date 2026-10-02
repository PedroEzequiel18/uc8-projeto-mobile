import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text } from 'react-native';

import { CartaoTransacao } from './src/components/CartaoTransacao';
import { FormularioTransacao } from './src/components/FormularioTransacao';

import type { Transacao } from './src/types/Transacao';

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

export default function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] =
    useState(true);

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
      <Text style={styles.titulo}>
        Carregando transações...
      </Text>
    );
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.container}
        data={transacoes}
        keyExtractor={(item) => String(item.id)}
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
          <CartaoTransacao
            transacao={item}
            destaque={item.id === 1}
          />
        )}
        ListEmptyComponent={
          <Text>Nenhuma transação cadastrada.</Text>
        }
      />

      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
});