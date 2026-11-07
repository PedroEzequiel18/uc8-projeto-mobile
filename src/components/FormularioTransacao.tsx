import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Botao } from './Botao';
import { Campo } from './Campo';
import { CampoData } from './CampoData';

import { hojeIso, textoParaValor } from '../utils/datas';

import { espacos, cores } from '../tema/tema';

import { categorias } from '../dados/categorias';

import type { Transacao } from '../types/Transacao';

interface FormularioTransacaoProps {
  aoCriar: (
    nome: string,
    descricao: string,
    valor: number,
    idCategoria: number,
    data: string,
  ) => void;

  // Preenchem o formulário (edição ou leitura de comprovante PIX).
  valoresIniciais?: Partial<Omit<Transacao, 'id'>>;
  textoBotao?: string;

  // Na edição, mantém os dados na tela depois de enviar.
  manterAposEnviar?: boolean;
}

export function FormularioTransacao({
  aoCriar,
  valoresIniciais,
  textoBotao = 'Criar Transação',
  manterAposEnviar = false,
}: FormularioTransacaoProps) {
  const [nome, setNome] = useState(valoresIniciais?.nome ?? '');

  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? '');

  const [valor, setValor] = useState(
    valoresIniciais?.valor !== undefined
      ? valoresIniciais.valor.toFixed(2).replace('.', ',')
      : '',
  );

  const [data, setData] = useState(
    valoresIniciais?.data?.slice(0, 10) ?? hojeIso(),
  );

  const [categoria, setCategoria] = useState(
    String(valoresIniciais?.id_categoria ?? 1),
  );

  const [tocado, setTocado] = useState(false);

  const [valorTocado, setValorTocado] = useState(false);

  const nomeVazio = nome.trim() === '';

  const erroNome =
    tocado && nomeVazio ? 'Informe o nome da transação' : undefined;

  const valorNumerico = textoParaValor(valor);

  const valorInvalido = !Number.isFinite(valorNumerico) || valorNumerico <= 0;

  const erroValor =
    valorTocado && valorInvalido
      ? 'Informe um valor maior que zero (ex.: 1.234,56)'
      : undefined;

  function mudarValor(texto: string) {
    setValorTocado(true);
    setValor(texto);
  }

  function mudarNome(texto: string) {
    setTocado(true);
    setNome(texto);
  }

  function criar() {
    aoCriar(
      nome,
      descricao,
      // Aceita "10,50", "1.234,56" e "10.5".
      valorNumerico,
      Number(categoria),
      data,
    );

    // Na edição, mantém os dados na tela.
    if (manterAposEnviar) {
      return;
    }

    setNome('');
    setDescricao('');
    setValor('');
    setCategoria('1');
    setData(hojeIso());
    setTocado(false);
    setValorTocado(false);
  }

  return (
    <View style={styles.container}>
      <Campo rotulo="Nome" valor={nome} aoMudar={mudarNome} erro={erroNome} />

      <Campo rotulo="Descrição" valor={descricao} aoMudar={setDescricao} />

      <Campo
        rotulo="Valor"
        valor={valor}
        aoMudar={mudarValor}
        erro={erroValor}
        tipoDeTeclado="decimal-pad"
      />

      <CampoData rotulo="Data" valor={data} aoMudar={setData} />

      <Text style={styles.rotuloCategoria}>Categoria</Text>

      <View style={styles.grupoCategorias}>
        {categorias.map((item) => {
          const selecionada = categoria === String(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => setCategoria(String(item.id))}
              style={[styles.chip, selecionada && styles.chipSelecionado]}
            >
              <Text
                style={[
                  styles.textoChip,
                  selecionada && styles.textoChipSelecionado,
                ]}
              >
                {item.nome}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.acoes}>
        <Botao
          titulo={textoBotao}
          onPress={criar}
          desabilitado={nomeVazio || valorInvalido}
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
