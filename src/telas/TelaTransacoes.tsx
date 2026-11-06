import { StatusBar } from "expo-status-bar";

import {
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RotasDaPilha } from "../navegacao/tipos";

import { CartaoTransacao } from "../components/CartaoTransacao";

import { useTransacoes } from "../contexto/TransacoesContexto";

import { cores, espacos, raio } from "../tema/tema";

import { categorias } from "../dados/categorias";
export default function TelaTransacoes() {
  const { estado, recarregar } = useTransacoes();

  const navigation = useNavigation<NativeStackNavigationProp<RotasDaPilha>>();

  const { width } = useWindowDimensions();

  const duasColunas = width >= 600;

  const transacoes = estado.tipo === "pronto" ? estado.transacoes : [];

  const receitas = transacoes
    .filter((transacao) => {
      const categoria = categorias.find((c) => c.id === transacao.id_categoria);

      return categoria?.tipo === "receita";
    })
    .reduce((soma, transacao) => soma + transacao.valor, 0);

  const despesas = transacoes
    .filter((transacao) => {
      const categoria = categorias.find((c) => c.id === transacao.id_categoria);

      return categoria?.tipo === "fixa" || categoria?.tipo === "variavel";
    })
    .reduce((soma, transacao) => soma + transacao.valor, 0);

  const saldo = receitas - despesas;
  if (estado.tipo === "carregando") {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.carregando}>Carregando transações...</Text>
      </View>
    );
  }

  if (estado.tipo === "erro") {
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
        key={duasColunas ? "duas" : "uma"}
        numColumns={duasColunas ? 2 : 1}
        columnWrapperStyle={duasColunas ? styles.linhaDeColunas : undefined}
        contentContainerStyle={styles.container}
        data={estado.transacoes}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
        
            <View style={styles.resumo}>
              <View style={styles.cardResumo}>
                <Text style={styles.rotuloResumo}>Receitas</Text>

                <Text style={styles.receitaResumo}>
                  R$ {receitas.toFixed(2)}
                </Text>
              </View>

              <View style={styles.cardResumo}>
                <Text style={styles.rotuloResumo}>Despesas</Text>

                <Text style={styles.despesaResumo}>
                  R$ {despesas.toFixed(2)}
                </Text>
              </View>

              <View style={styles.cardResumo}>
                <Text style={styles.rotuloResumo}>Saldo</Text>

                <Text style={styles.saldoResumo}>R$ {saldo.toFixed(2)}</Text>
              </View>
            </View>
            <Pressable
              style={styles.botaoNova}
              onPress={() => navigation.navigate("NovaTransacao")}
            >
              <Text style={styles.textoBotao}>➕ Nova Transação</Text>
            </Pressable>

            {estado.origem === "aparelho" && (
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
          <Text style={styles.vazio}>Nenhuma transação cadastrada.</Text>
        }
      />

      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    backgroundColor: cores.papel,
    flexGrow: 1,
  },

  titulo: {
  color: cores.tinta,
  fontSize: 30,
  fontWeight: '700',
  marginBottom: espacos.sm,
},

  subtitulo: {
    color: cores.tintaSuave,
    marginBottom: espacos.lg,
  },

  botaoNova: {
    backgroundColor: cores.receita,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.lg,
  },

  textoBotao: {
    textAlign: "center",
    fontWeight: "700",
    color: cores.papelCartao,
  },

  aviso: {
    marginBottom: espacos.sm,
    color: "#d97706",
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  carregando: {
    marginTop: espacos.sm,
  },

  erro: {
    color: "red",
    fontWeight: "700",
  },

  recarregar: {
    marginTop: espacos.md,
    color: "blue",
  },

  vazio: {
    textAlign: "center",
    color: cores.tintaSuave,
  },

  linhaDeColunas: {
    gap: espacos.sm,
  },

  celula: {
    flex: 1,
  },

  resumo: {
    marginBottom: espacos.lg,
  },

  cardResumo: {
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: espacos.md,
    marginBottom: espacos.sm,
  },

  rotuloResumo: {
    color: cores.tintaSuave,
    fontSize: 12,
    fontWeight: "700",
  },

  receitaResumo: {
    color: cores.receita,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },

  despesaResumo: {
    color: cores.despesa,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },

  saldoResumo: {
    color: cores.tinta,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
});
