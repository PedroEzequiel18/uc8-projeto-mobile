import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { categorias } from '../dados/categorias';

import { cores, espacos, raio } from '../tema/tema';

import { useNavigation } from '@react-navigation/native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { RotasDasAbas } from '../navegacao/tipos';

import { useFiltros, type TipoFiltro } from '../contexto/FiltrosContexto';

import { CampoData } from '../components/CampoData';

export default function TelaFiltros() {
  const { filtros, atualizar } = useFiltros();

  const navigation = useNavigation<BottomTabNavigationProp<RotasDasAbas>>();

  // Começa com os filtros que já estão aplicados.
  const [tipo, setTipo] = useState<TipoFiltro>(filtros.tipo);

  const [categoria, setCategoria] = useState(filtros.categoria);

  // Datas guardadas como "aaaa-mm-dd" ("" = sem limite).
  const [dataInicial, setDataInicial] = useState(filtros.dataInicial);

  const [dataFinal, setDataFinal] = useState(filtros.dataFinal);

  const [erro, setErro] = useState<string | undefined>();

  function filtrar() {
    if (dataInicial && dataFinal && dataInicial > dataFinal) {
      setErro('A data inicial não pode ser depois da data final.');
      return;
    }

    setErro(undefined);

    atualizar({
      tipo,
      categoria,
      dataInicial,
      dataFinal,
    });

    navigation.navigate('AbaTransacoes', { screen: 'Transacoes' });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Filtros</Text>

      <Text style={styles.rotulo}>Tipo</Text>

      <View style={styles.grupo}>
        <Chip
          texto="Todos"
          ativo={tipo === 'Todos'}
          aoPressionar={() => setTipo('Todos')}
        />

        <Chip
          texto="Receitas"
          ativo={tipo === 'Receitas'}
          aoPressionar={() => setTipo('Receitas')}
        />

        <Chip
          texto="Despesas"
          ativo={tipo === 'Despesas'}
          aoPressionar={() => setTipo('Despesas')}
        />
      </View>
      <Text style={styles.rotulo}>Categoria selecionada</Text>

      <View style={styles.caixa}>
        <Text style={styles.valor}>{categoria}</Text>
      </View>

      <Text style={styles.listaCategorias}>Selecionar categoria:</Text>

      <View style={styles.grupo}>
        <Chip
          texto="Todas"
          ativo={categoria === 'Todas'}
          aoPressionar={() => setCategoria('Todas')}
        />

        {categorias.map((item) => (
          <Chip
            key={item.id}
            texto={item.nome}
            ativo={categoria === item.nome}
            aoPressionar={() => setCategoria(item.nome)}
          />
        ))}
      </View>

      <View style={styles.datas}>
        <CampoData
          rotulo="Data Inicial"
          valor={dataInicial}
          aoMudar={setDataInicial}
          permitirVazio
          textoVazio="Sem limite"
        />

        <CampoData
          rotulo="Data Final"
          valor={dataFinal}
          aoMudar={setDataFinal}
          permitirVazio
          textoVazio="Sem limite"
        />
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <Pressable style={styles.botaoFiltrar} onPress={filtrar}>
        <Text style={styles.textoBotao}>Filtrar</Text>
      </Pressable>

      <Pressable
        style={styles.botaoLimpar}
        onPress={() => {
          setTipo('Todos');
          setCategoria('Todas');
          setDataInicial('');
          setDataFinal('');
          setErro(undefined);

          atualizar({
            tipo: 'Todos',
            categoria: 'Todas',
            dataInicial: '',
            dataFinal: '',
          });
        }}
      >
        <Text style={styles.textoBotaoLimpar}>Limpar</Text>
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
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>
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
    marginBottom: espacos.lg,
  },

  rotulo: {
    color: cores.tinta,
    fontWeight: '700',
    marginBottom: espacos.sm,
    marginTop: espacos.md,
  },

  grupo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },

  chip: {
    borderWidth: 1,
    borderColor: cores.borda,

    backgroundColor: cores.papelCartao,

    borderRadius: 999,

    paddingHorizontal: 14,

    paddingVertical: 8,
  },

  chipAtivo: {
    backgroundColor: cores.receita,
    borderColor: cores.receita,
  },

  textoChip: {
    color: cores.tinta,
    fontWeight: '600',
  },

  textoChipAtivo: {
    color: cores.papelCartao,
  },

  caixa: {
    backgroundColor: cores.papelCartao,

    borderWidth: 1,

    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,
  },

  valor: {
    color: cores.tinta,
  },

  listaCategorias: {
    marginTop: espacos.md,
    marginBottom: espacos.sm,
    color: cores.tinta,
    fontWeight: '600',
  },

  categoria: {
    color: cores.tintaSuave,
    marginBottom: 6,
  },

  datas: {
    marginTop: espacos.md,
  },

  input: {
    backgroundColor: cores.papelCartao,

    borderWidth: 1,

    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,
  },

  botaoFiltrar: {
    backgroundColor: cores.receita,

    borderRadius: raio,

    padding: espacos.md,

    marginTop: espacos.lg,
  },

  textoBotao: {
    textAlign: 'center',
    color: cores.papelCartao,
    fontWeight: '700',
  },

  botaoLimpar: {
    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,

    marginTop: espacos.sm,
  },

  erro: {
    color: cores.despesa,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  textoBotaoLimpar: {
    textAlign: 'center',
    color: cores.tinta,
    fontWeight: '700',
  },
});
