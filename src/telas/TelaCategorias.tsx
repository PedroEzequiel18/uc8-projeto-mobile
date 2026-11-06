import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { categorias } from "../dados/categorias";

import { cores, espacos, raio } from "../tema/tema";

export default function TelaCategorias() {
  const receitas = categorias.filter(
    (categoria) => categoria.tipo === "receita",
  );

  const fixas = categorias.filter((categoria) => categoria.tipo === "fixa");

  const variaveis = categorias.filter(
    (categoria) => categoria.tipo === "variavel",
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Categorias</Text>
      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>💰 Receitas: {receitas.length}</Text>

        <Text style={styles.resumoTexto}>📌 Fixas: {fixas.length}</Text>

        <Text style={styles.resumoTexto}>🛒 Variáveis: {variaveis.length}</Text>

        <Text style={styles.resumoTotal}>Total: {categorias.length}</Text>
      </View>

      <TextoGrupo titulo={`💰 Receitas (${receitas.length})`} />

      {receitas.map((categoria) => (
        <CardCategoria
          key={categoria.id}
          nome={categoria.nome}
          tipo="Receita"
        />
      ))}

      <TextoGrupo titulo={`📌 Despesas Fixas (${fixas.length})`} />

      {fixas.map((categoria) => (
        <CardCategoria
          key={categoria.id}
          nome={categoria.nome}
          tipo="Despesa Fixa"
        />
      ))}

      <TextoGrupo titulo={`🛒 Despesas Variáveis (${variaveis.length})`} />

      {variaveis.map((categoria) => (
        <CardCategoria
          key={categoria.id}
          nome={categoria.nome}
          tipo="Despesa Variável"
        />
      ))}
    </ScrollView>
  );
}

function TextoGrupo({ titulo }: { titulo: string }) {
  return <Text style={styles.grupo}>{titulo}</Text>;
}

function CardCategoria({ nome, tipo }: { nome: string; tipo: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{nome}</Text>

      <Text style={styles.tipo}>{tipo}</Text>

      <Text style={styles.uso}>Utilizada em transações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    paddingTop: 50,
    backgroundColor: cores.papel,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: cores.tinta,
    marginBottom: espacos.sm,
  },

  resumo: {
    backgroundColor: cores.papelCartao,

    borderWidth: 1,

    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.md,
  },

  resumoTexto: {
    color: cores.tinta,
    fontWeight: "600",
  },
  resumoTotal: {
    marginTop: 8,
    color: cores.tinta,
    fontSize: 16,
    fontWeight: "700",
  },
  botao: {
    backgroundColor: cores.receita,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.lg,
  },

  textoBotao: {
    textAlign: "center",
    color: cores.papelCartao,
    fontWeight: "700",
  },

  grupo: {
    fontSize: 18,
    fontWeight: "700",
    color: cores.tinta,
    marginBottom: espacos.sm,
    marginTop: espacos.md,
  },

  card: {
    backgroundColor: cores.papelCartao,

    borderWidth: 1,

    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.sm,
  },

  nome: {
    color: cores.tinta,
    fontSize: 16,
    fontWeight: "700",
  },

  tipo: {
    color: cores.tintaSuave,
    marginTop: 4,
  },

  uso: {
    color: cores.tintaSuave,
    marginTop: 6,
    fontSize: 12,
  },
});
