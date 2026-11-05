import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { categorias } from '../dados/categorias';

import {
  cores,
  espacos,
  raio,
} from '../tema/tema';

export default function TelaFiltros() {
  const [tipo, setTipo] =
    useState('Todos');

  const [categoria, setCategoria] =
    useState('Todas');

  const [dataInicial, setDataInicial] =
    useState('');

  const [dataFinal, setDataFinal] =
    useState('');

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        Filtros
      </Text>

      <Text style={styles.rotulo}>
        Tipo
      </Text>

      <View style={styles.grupo}>
        <Chip
          texto="Todos"
          ativo={
            tipo === 'Todos'
          }
          aoPressionar={() =>
            setTipo('Todos')
          }
        />

        <Chip
          texto="Receitas"
          ativo={
            tipo ===
            'Receitas'
          }
          aoPressionar={() =>
            setTipo(
              'Receitas',
            )
          }
        />

        <Chip
          texto="Despesas"
          ativo={
            tipo ===
            'Despesas'
          }
          aoPressionar={() =>
            setTipo(
              'Despesas',
            )
          }
        />
      </View>

      <Text style={styles.rotulo}>
        Categoria
      </Text>

      <View style={styles.caixa}>
        <Text style={styles.valor}>
          {categoria}
        </Text>
      </View>

      <Text
        style={
          styles.listaCategorias
        }
      >
        Categorias disponíveis:
      </Text>

      {categorias.map(
        (item) => (
          <Pressable
            key={item.id}
            onPress={() =>
              setCategoria(
                item.nome,
              )
            }
          >
            <Text
              style={
                styles.categoria
              }
            >
              • {item.nome}
            </Text>
          </Pressable>
        ),
      )}

      <Text style={styles.rotulo}>
        Data Inicial
      </Text>

      <TextInput
        style={styles.input}
        value={dataInicial}
        onChangeText={
          setDataInicial
        }
        placeholder="dd/mm/aaaa"
      />

      <Text style={styles.rotulo}>
        Data Final
      </Text>

      <TextInput
        style={styles.input}
        value={dataFinal}
        onChangeText={
          setDataFinal
        }
        placeholder="dd/mm/aaaa"
      />

      <Pressable
        style={styles.botaoFiltrar}
      >
        <Text
          style={
            styles.textoBotao
          }
        >
          Filtrar
        </Text>
      </Pressable>

      <Pressable
        style={styles.botaoLimpar}
        onPress={() => {
          setTipo('Todos');
          setCategoria(
            'Todas',
          );
          setDataInicial('');
          setDataFinal('');
        }}
      >
        <Text
          style={
            styles.textoBotaoLimpar
          }
        >
          Limpar
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Chip({
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
      onPress={aoPressionar}
      style={[
        styles.chip,
        ativo &&
          styles.chipAtivo,
      ]}
    >
      <Text
        style={[
          styles.textoChip,
          ativo &&
            styles.textoChipAtivo,
        ]}
      >
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
  padding: espacos.md,
  paddingTop: 50,
  backgroundColor: cores.papel,
},

  titulo: {
    color: cores.tinta,
    fontSize: 26,
    fontWeight: '700',
    marginBottom:
      espacos.lg,
  },

  rotulo: {
    color: cores.tinta,
    fontWeight: '700',
    marginBottom:
      espacos.sm,
    marginTop:
      espacos.md,
  },

  grupo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },

  chip: {
    borderWidth: 1,
    borderColor:
      cores.borda,

    backgroundColor:
      cores.papelCartao,

    borderRadius: 999,

    paddingHorizontal: 14,

    paddingVertical: 8,
  },

  chipAtivo: {
    backgroundColor:
      cores.receita,
    borderColor:
      cores.receita,
  },

  textoChip: {
    color: cores.tinta,
    fontWeight: '600',
  },

  textoChipAtivo: {
    color:
      cores.papelCartao,
  },

  caixa: {
    backgroundColor:
      cores.papelCartao,

    borderWidth: 1,

    borderColor:
      cores.borda,

    borderRadius: raio,

    padding: espacos.md,
  },

  valor: {
    color: cores.tinta,
  },

  listaCategorias: {
    marginTop: espacos.md,
    marginBottom:
      espacos.sm,
    color: cores.tinta,
    fontWeight: '600',
  },

  categoria: {
    color:
      cores.tintaSuave,
    marginBottom: 6,
  },

  input: {
    backgroundColor:
      cores.papelCartao,

    borderWidth: 1,

    borderColor:
      cores.borda,

    borderRadius: raio,

    padding: espacos.md,
  },

  botaoFiltrar: {
    backgroundColor:
      cores.receita,

    borderRadius: raio,

    padding: espacos.md,

    marginTop:
      espacos.lg,
  },

  textoBotao: {
    textAlign: 'center',
    color:
      cores.papelCartao,
    fontWeight: '700',
  },

  botaoLimpar: {
    borderWidth: 1,
    borderColor:
      cores.borda,

    borderRadius: raio,

    padding: espacos.md,

    marginTop:
      espacos.sm,
  },

  textoBotaoLimpar: {
    textAlign: 'center',
    color: cores.tinta,
    fontWeight: '700',
  },
});