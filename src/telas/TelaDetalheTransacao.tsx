import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTransacoes } from '../contexto/TransacoesContexto';
import { categorias } from '../dados/categorias';
import { dataParaTexto } from '../utils/datas';
import { formatarMoeda } from '../utils/financeiro';
import { cores, espacos, raio } from '../tema/tema';

import type { RotasDaPilha } from '../navegacao/tipos';

type TelaDetalheTransacaoProps = NativeStackScreenProps<
  RotasDaPilha,
  'DetalheTransacao'
>;

export default function TelaDetalheTransacao({
  route,
  navigation,
}: TelaDetalheTransacaoProps) {
  const { id } = route.params;

  const { buscar, remover } = useTransacoes();

  const transacao = buscar(id);
  const categoria = categorias.find((c) => c.id === transacao?.id_categoria);
  async function excluir() {
    Alert.alert(
      'Excluir Transação',
      'Deseja realmente excluir esta transação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await remover(id);

              navigation.goBack();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a transação.');
            }
          },
        },
      ],
    );
  }

  if (transacao === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Transação não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cartao}>
        <Text style={styles.titulo}>{transacao.nome}</Text>

        <Text style={styles.descricao}>{transacao.descricao}</Text>

        <View style={styles.blocoValor}>
          <Text style={styles.rotulo}>VALOR</Text>

          <Text style={styles.valor}>{formatarMoeda(transacao.valor)}</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>DATA</Text>

          <Text style={styles.texto}>{dataParaTexto(transacao.data)}</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>CATEGORIA</Text>

          <Text style={styles.texto}>
            {categoria?.nome ?? 'Categoria não encontrada'}
          </Text>
        </View>

        <Pressable
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('EditarTransacao', { id })}
        >
          <Text style={styles.textoExcluir}>✏️ Editar Transação</Text>
        </Pressable>

        <Pressable style={styles.botaoExcluir} onPress={excluir}>
          <Text style={styles.textoExcluir}>🗑️ Excluir Transação</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.papel,
    padding: espacos.md,
  },

  cartao: {
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: espacos.lg,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 24,
    fontWeight: '700',
  },

  descricao: {
    color: cores.tintaSuave,
    marginTop: espacos.sm,
    marginBottom: espacos.lg,
  },

  blocoValor: {
    marginBottom: espacos.lg,
  },

  rotulo: {
    color: cores.tintaSuave,
    fontSize: 12,
    fontWeight: '600',
  },

  valor: {
    color: cores.receita,
    fontSize: 32,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  linha: {
    marginTop: espacos.md,
  },

  texto: {
    color: cores.tinta,
    fontSize: 16,
    marginTop: espacos.xs,
  },

  botaoEditar: {
    marginTop: espacos.lg,
    backgroundColor: cores.receita,
    padding: espacos.md,
    borderRadius: raio,
  },

  botaoExcluir: {
    marginTop: espacos.sm,
    backgroundColor: cores.despesa,
    padding: espacos.md,
    borderRadius: raio,
  },

  textoExcluir: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});
