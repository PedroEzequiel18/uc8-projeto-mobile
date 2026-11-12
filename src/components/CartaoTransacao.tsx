import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RotasDaPilha } from '../navegacao/tipos';
import type { Transacao } from '../types/Transacao';

import { cores, espacos, raio } from '../tema/tema';

import { useCategorias } from '../contexto/CategoriasContexto';

import { dataParaTexto } from '../utils/datas';
import { formatarMoeda } from '../utils/financeiro';

interface CartaoTransacaoProps {
  transacao: Transacao;
}

export function CartaoTransacao({ transacao }: CartaoTransacaoProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RotasDaPilha>>();

  const { categorias } = useCategorias();

  const categoria = categorias.find((c) => c.id === transacao.id_categoria);

  const ehDespesa =
    categoria?.tipo === 'fixa' || categoria?.tipo === 'variavel';

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('DetalheTransacao', {
          id: transacao.id,
        })
      }
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
    >
      <View style={estilos.linhaTopo}>
        <View style={estilos.textos}>
          <Text style={estilos.titulo} numberOfLines={1}>
            {transacao.nome}
          </Text>

          {!!transacao.descricao && (
            <Text style={estilos.descricao} numberOfLines={2}>
              {transacao.descricao}
            </Text>
          )}
        </View>

        <Text
          style={[
            estilos.valor,
            ehDespesa ? estilos.valorDespesa : estilos.valorReceita,
          ]}
        >
          {formatarMoeda(transacao.valor)}
        </Text>
      </View>

      <View style={estilos.linhaRodape}>
        <Text style={estilos.etiqueta}>
          {categoria?.nome ?? `Categoria ${transacao.id_categoria}`}
        </Text>

        <Text style={estilos.data}>{dataParaTexto(transacao.data)}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.papelCartao,

    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.sm,

    elevation: 1,
  },

  pressionado: {
    opacity: 0.7,
  },

  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'flex-start',

    gap: espacos.sm,
  },

  textos: {
    flex: 1,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 16,
    fontWeight: '700',
  },

  descricao: {
    color: cores.tintaSuave,
    marginTop: espacos.xs,
  },

  valor: {
    fontSize: 16,
    fontWeight: '700',
  },

  valorReceita: {
    color: cores.receita,
  },

  valorDespesa: {
    color: cores.despesa,
  },

  linhaRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: espacos.md,
  },

  etiqueta: {
    color: cores.tintaSuave,
    fontSize: 12,

    backgroundColor: cores.papel,

    paddingHorizontal: espacos.sm,

    paddingVertical: 2,

    borderRadius: 8,
  },

  data: {
    color: cores.tintaSuave,
    fontSize: 12,
  },
});
