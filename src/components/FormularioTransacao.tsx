import { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Botao } from './Botao';
import { Campo } from './Campo';

import {
  espacos,
  cores,
} from '../tema/tema';

import { categorias } from '../dados/categorias';

interface FormularioTransacaoProps {
  aoCriar: (
    nome: string,
    descricao: string,
    valor: number,
    idCategoria: number,
    data: string,
  ) => void;
}

export function FormularioTransacao({
  aoCriar,
}: FormularioTransacaoProps) {
  const [nome, setNome] = useState('');

  const [descricao, setDescricao] =
    useState('');

  const [valor, setValor] =
    useState('');

  const [data, setData] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10),
    );

  const [categoria, setCategoria] =
    useState('1');

  const [tocado, setTocado] =
    useState(false);

  const nomeVazio =
    nome.trim() === '';

  const erroNome =
    tocado && nomeVazio
      ? 'Informe o nome da transação'
      : undefined;

  function mudarNome(texto: string) {
    setTocado(true);
    setNome(texto);
  }

  function criar() {
    aoCriar(
      nome,
      descricao,
      Number(valor) || 0,
      Number(categoria),
      data,
    );

    setNome('');
    setDescricao('');
    setValor('');
    setCategoria('1');

    setData(
      new Date()
        .toISOString()
        .slice(0, 10),
    );

    setTocado(false);
  }

  return (
    <View style={styles.container}>
      <Campo
        rotulo="Nome"
        valor={nome}
        aoMudar={mudarNome}
        erro={erroNome}
      />

      <Campo
        rotulo="Descrição"
        valor={descricao}
        aoMudar={setDescricao}
      />

      <Campo
        rotulo="Valor"
        valor={valor}
        aoMudar={setValor}
        tipoDeTeclado="numeric"
      />

      <Campo
        rotulo="Data"
        valor={data}
        aoMudar={setData}
      />

      <Text style={styles.rotuloCategoria}>
        Categoria
      </Text>

      <View style={styles.grupoCategorias}>
        {categorias.map((item) => {
          const selecionada =
            categoria === String(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() =>
                setCategoria(
                  String(item.id),
                )
              }
              style={[
                styles.chip,
                selecionada &&
                  styles.chipSelecionado,
              ]}
            >
              <Text
                style={[
                  styles.textoChip,
                  selecionada &&
                    styles.textoChipSelecionado,
                ]}
              >
                {item.nome}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.selecionada}>
        Selecionada:{' '}
        {
          categorias.find(
            (c) =>
              c.id ===
              Number(categoria),
          )?.nome
        }
      </Text>

      <View style={styles.acoes}>
        <Botao
          titulo="Criar Transação"
          onPress={criar}
          desabilitado={nomeVazio}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },

  rotuloCategoria: {
    color: cores.tintaSuave,
    marginTop: espacos.sm,
    marginBottom: espacos.sm,
  },

  grupoCategorias: {
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

  chipSelecionado: {
    backgroundColor: cores.receita,
    borderColor: cores.receita,
  },

  textoChip: {
    color: cores.tinta,
    fontWeight: '600',
  },

  textoChipSelecionado: {
    color: cores.papelCartao,
  },

  selecionada: {
    color: cores.receita,
    marginTop: espacos.sm,
    marginBottom: espacos.md,
    fontWeight: '600',
  },

  acoes: {
    flexDirection: 'row',
    marginTop: espacos.sm,
  },
});