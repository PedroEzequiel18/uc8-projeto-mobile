import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Botao } from './Botao';
import { Campo } from './Campo';
import { CampoData } from './CampoData';

import { hojeIso, textoParaValor } from '../utils/datas';

import { espacos, cores } from '../tema/tema';

import { useCategorias } from '../contexto/CategoriasContexto';

import type { Categoria } from '../types/Categoria';

import type { Transacao } from '../types/Transacao';

type TipoLancamento = 'receita' | 'despesa';

// Despesa reúne as categorias fixas e as variáveis.
function ehDoTipo(categoria: Categoria, tipo: TipoLancamento): boolean {
  return tipo === 'receita'
    ? categoria.tipo === 'receita'
    : categoria.tipo !== 'receita';
}

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
  const { categorias } = useCategorias();

  const [nome, setNome] = useState(valoresIniciais?.nome ?? '');

  // Não há mais campo de descrição: o que já existia numa transação é mantido.
  const descricao = valoresIniciais?.descricao ?? '';

  const [valor, setValor] = useState(
    valoresIniciais?.valor !== undefined
      ? valoresIniciais.valor.toFixed(2).replace('.', ',')
      : '',
  );

  const [data, setData] = useState(
    valoresIniciais?.data?.slice(0, 10) ?? hojeIso(),
  );

  const idInicial = valoresIniciais?.id_categoria;

  // O tipo vem da categoria (edição); sem categoria, começa em Despesa,
  // que é o caso mais comum de um comprovante PIX.
  const [tipo, setTipo] = useState<TipoLancamento>(
    idInicial !== undefined &&
      categorias.find((c) => c.id === idInicial)?.tipo === 'receita'
      ? 'receita'
      : 'despesa',
  );

  const [categoria, setCategoria] = useState(
    String(
      idInicial ??
        categorias.find((c) => ehDoTipo(c, 'despesa'))?.id ??
        categorias[0]?.id ??
        1,
    ),
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

  // Ao trocar o tipo, a categoria passa para a primeira daquele tipo.
  function escolherTipo(novo: TipoLancamento) {
    setTipo(novo);

    const primeira = categorias.find((c) => ehDoTipo(c, novo));

    if (primeira !== undefined) {
      setCategoria(String(primeira.id));
    }
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
    setValor('');
    setTipo('despesa');
    setCategoria(
      String(categorias.find((c) => ehDoTipo(c, 'despesa'))?.id ?? 1),
    );
    setData(hojeIso());
    setTocado(false);
    setValorTocado(false);
  }

  return (
    <View style={styles.container}>
      <Campo rotulo="Nome" valor={nome} aoMudar={mudarNome} erro={erroNome} />

      <Campo
        rotulo="Valor"
        valor={valor}
        aoMudar={mudarValor}
        erro={erroValor}
        tipoDeTeclado="decimal-pad"
      />

      <CampoData rotulo="Data" valor={data} aoMudar={setData} />

      <Text style={styles.rotuloCategoria}>Tipo</Text>

      <View style={styles.grupoTipo}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: tipo === 'receita' }}
          onPress={() => escolherTipo('receita')}
          style={[
            styles.botaoTipo,
            tipo === 'receita' && styles.tipoReceitaAtivo,
          ]}
        >
          <Text
            style={[
              styles.textoTipo,
              tipo === 'receita' && styles.textoTipoAtivo,
            ]}
          >
            Receita
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: tipo === 'despesa' }}
          onPress={() => escolherTipo('despesa')}
          style={[
            styles.botaoTipo,
            tipo === 'despesa' && styles.tipoDespesaAtivo,
          ]}
        >
          <Text
            style={[
              styles.textoTipo,
              tipo === 'despesa' && styles.textoTipoAtivo,
            ]}
          >
            Despesa
          </Text>
        </Pressable>
      </View>

      <Text style={styles.rotuloCategoria}>Categoria</Text>

      <View style={styles.grupoCategorias}>
        {categorias
          .filter((item) => ehDoTipo(item, tipo))
          .map((item) => {
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

  grupoTipo: {
    flexDirection: 'row',
    gap: espacos.sm,
  },

  botaoTipo: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.papelCartao,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  tipoReceitaAtivo: {
    backgroundColor: cores.receita,
    borderColor: cores.receita,
  },

  tipoDespesaAtivo: {
    backgroundColor: cores.despesa,
    borderColor: cores.despesa,
  },

  textoTipo: {
    color: cores.tinta,
    fontWeight: '700',
  },

  textoTipoAtivo: {
    color: cores.papelCartao,
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
