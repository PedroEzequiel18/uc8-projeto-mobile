import { useState } from 'react';

import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { CabecalhoTela } from '../components/CabecalhoTela';

import { useFiltros } from '../contexto/FiltrosContexto';

import { useTransacoes } from '../contexto/TransacoesContexto';

import { categorias } from '../dados/categorias';

import type { RotasDasAbas } from '../navegacao/tipos';

import type { Categoria } from '../types/Categoria';

import type { Transacao } from '../types/Transacao';

import { limitesDoMes } from '../utils/datas';

import { doMes, formatarMoeda, nomeDoMes } from '../utils/financeiro';

import { cores, espacos, raio } from '../tema/tema';

interface MesEscolhido {
  ano: number;
  mes: number; // 0 a 11
}

interface ResumoCategoria {
  categoria: Categoria;
  total: number;
  quantidade: number;
}

interface Grupo {
  tipo: Categoria['tipo'];
  titulo: string;
  descricao: string;
  cor: string;
}

const GRUPOS: Grupo[] = [
  {
    tipo: 'receita',
    titulo: 'Receitas',
    descricao: 'Dinheiro que entra',
    cor: cores.receita,
  },
  {
    tipo: 'fixa',
    titulo: 'Despesas Fixas',
    descricao: 'Contas que se repetem todo mês',
    cor: cores.despesa,
  },
  {
    tipo: 'variavel',
    titulo: 'Despesas Variáveis',
    descricao: 'Gastos do dia a dia',
    cor: cores.despesa,
  },
];

function resumirPorCategoria(transacoes: Transacao[]): ResumoCategoria[] {
  return categorias.map((categoria) => {
    const daCategoria = transacoes.filter(
      (t) => t.id_categoria === categoria.id,
    );

    return {
      categoria,
      total: daCategoria.reduce((soma, t) => soma + t.valor, 0),
      quantidade: daCategoria.length,
    };
  });
}

export default function TelaCategorias() {
  const { estado } = useTransacoes();

  const { atualizar } = useFiltros();

  const navigation = useNavigation<BottomTabNavigationProp<RotasDasAbas>>();

  const hoje = new Date();

  const [mesEscolhido, setMesEscolhido] = useState<MesEscolhido>({
    ano: hoje.getFullYear(),
    mes: hoje.getMonth(),
  });

  const [todoPeriodo, setTodoPeriodo] = useState(false);

  const [mostrarVazias, setMostrarVazias] = useState(false);

  const todas = estado.tipo === 'pronto' ? estado.transacoes : [];

  const doPeriodo = todoPeriodo
    ? todas
    : doMes(todas, mesEscolhido.ano, mesEscolhido.mes);

  const resumos = resumirPorCategoria(doPeriodo);

  const semMovimento = resumos.filter((r) => r.quantidade === 0).length;

  // Número do mês para comparar: ano * 12 + mês.
  const indiceEscolhido = mesEscolhido.ano * 12 + mesEscolhido.mes;

  const indiceAtual = hoje.getFullYear() * 12 + hoje.getMonth();

  // Não deixa voltar para antes da transação mais antiga.
  const maisAntiga = todas.reduce<number>((menor, t) => {
    const [ano, mes] = t.data.slice(0, 7).split('-').map(Number);

    return Math.min(menor, ano * 12 + (mes - 1));
  }, indiceAtual);

  const podeVoltar = indiceEscolhido > maisAntiga;

  const podeAvancar = indiceEscolhido < indiceAtual;

  function mudarMes(passo: number) {
    const novo = new Date(mesEscolhido.ano, mesEscolhido.mes + passo, 1);

    setMesEscolhido({ ano: novo.getFullYear(), mes: novo.getMonth() });
    setTodoPeriodo(false);
  }

  // Abre a aba Transações já filtrada pela categoria (e pelo mês, se for o caso).
  function verTransacoes(categoria: Categoria) {
    const limites = todoPeriodo
      ? undefined
      : limitesDoMes(mesEscolhido.ano, mesEscolhido.mes);

    atualizar({
      tipo: 'Todos',
      categoria: categoria.nome,
      dataInicial: limites?.inicio ?? '',
      dataFinal: limites?.fim ?? '',
    });

    navigation.navigate('AbaTransacoes', {
      screen: 'Transacoes',
      params: { origem: 'categorias' },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CabecalhoTela
        sobretitulo="ORGANIZAÇÃO"
        titulo="Categorias"
        explicacao="Veja quanto cada categoria movimentou. Toque numa categoria para ver as transações dela."
      />

      <View style={styles.periodos}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
          disabled={!podeVoltar}
          onPress={() => mudarMes(-1)}
          style={[styles.botaoMes, !podeVoltar && styles.setaDesligada]}
        >
          <Text style={styles.textoSeta}>‹</Text>
        </Pressable>

        <Text style={styles.nomeMes} numberOfLines={1}>
          {todoPeriodo
            ? 'Todos os períodos'
            : nomeDoMes(mesEscolhido.ano, mesEscolhido.mes)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
          disabled={!podeAvancar}
          onPress={() => mudarMes(1)}
          style={[styles.botaoMes, !podeAvancar && styles.setaDesligada]}
        >
          <Text style={styles.textoSeta}>›</Text>
        </Pressable>

        <ChipPeriodo
          texto="Tudo"
          ativo={todoPeriodo}
          aoPressionar={() => setTodoPeriodo(!todoPeriodo)}
        />
      </View>

      {semMovimento > 0 && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setMostrarVazias(!mostrarVazias)}
          style={styles.alternarVazias}
        >
          <Text style={styles.textoAlternar}>
            {mostrarVazias
              ? 'Ocultar categorias sem movimento'
              : `Mostrar categorias sem movimento (${semMovimento})`}
          </Text>
        </Pressable>
      )}

      {estado.tipo === 'carregando' && (
        <Text style={styles.aviso}>Carregando transações...</Text>
      )}

      {GRUPOS.map((grupo) => {
        const doGrupo = resumos
          .filter((r) => r.categoria.tipo === grupo.tipo)
          .sort((a, b) => b.total - a.total);

        const totalGrupo = doGrupo.reduce((soma, r) => soma + r.total, 0);

        // Por padrão, só mostra as categorias que tiveram movimento.
        const visiveis = mostrarVazias
          ? doGrupo
          : doGrupo.filter((r) => r.quantidade > 0);

        return (
          <View key={grupo.tipo} style={styles.grupo}>
            <View style={styles.cabecalhoGrupo}>
              <View style={[styles.marca, { backgroundColor: grupo.cor }]} />

              <View style={styles.textosGrupo}>
                <Text style={styles.tituloGrupo}>{grupo.titulo}</Text>
                <Text style={styles.descricaoGrupo}>{grupo.descricao}</Text>
              </View>

              <Text style={styles.totalGrupo}>{formatarMoeda(totalGrupo)}</Text>
            </View>

            {visiveis.length === 0 && (
              <Text style={styles.grupoVazio}>Nada neste período.</Text>
            )}

            {visiveis.map((resumo) => (
              <LinhaCategoria
                key={resumo.categoria.id}
                resumo={resumo}
                totalGrupo={totalGrupo}
                cor={grupo.cor}
                aoPressionar={() => verTransacoes(resumo.categoria)}
              />
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

function LinhaCategoria({
  resumo,
  totalGrupo,
  cor,
  aoPressionar,
}: {
  resumo: ResumoCategoria;
  totalGrupo: number;
  cor: string;
  aoPressionar: () => void;
}) {
  const semMovimento = resumo.quantidade === 0;

  const percentual = totalGrupo > 0 ? (resumo.total / totalGrupo) * 100 : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        semMovimento
          ? `${resumo.categoria.nome}: sem movimentação`
          : `${resumo.categoria.nome}: ${formatarMoeda(resumo.total)}, ${resumo.quantidade} transações. Toque para ver.`
      }
      onPress={aoPressionar}
      style={({ pressed }) => [styles.linha, pressed && styles.pressionado]}
    >
      <View style={styles.topoLinha}>
        <Text
          style={[styles.nome, semMovimento && styles.textoApagado]}
          numberOfLines={1}
        >
          {resumo.categoria.nome}
        </Text>

        <Text style={[styles.valor, semMovimento && styles.textoApagado]}>
          {semMovimento ? '—' : formatarMoeda(resumo.total)}
        </Text>

        <Text style={styles.seta}>›</Text>
      </View>

      {!semMovimento && (
        <>
          <View style={styles.trilho}>
            <View
              style={[
                styles.barra,
                {
                  width: `${Math.max(percentual, 2)}%`,
                  backgroundColor: cor,
                },
              ]}
            />
          </View>

          <Text style={styles.detalhe}>
            {resumo.quantidade}{' '}
            {resumo.quantidade === 1 ? 'transação' : 'transações'} ·{' '}
            {percentual.toFixed(0)}% do grupo
          </Text>
        </>
      )}

      {semMovimento && (
        <Text style={styles.detalhe}>Sem movimentação no período</Text>
      )}
    </Pressable>
  );
}

function ChipPeriodo({
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
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      onPress={aoPressionar}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const fonteSerifada = Platform.select({ ios: 'Georgia', default: 'serif' });

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    paddingTop: 50,
    paddingBottom: espacos.lg * 2,
    backgroundColor: cores.papel,
    flexGrow: 1,
  },

  periodos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    marginBottom: espacos.md,
  },

  botaoMes: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.papelCartao,
    alignItems: 'center',
    justifyContent: 'center',
  },

  setaDesligada: {
    opacity: 0.35,
  },

  textoSeta: {
    color: cores.tinta,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },

  nomeMes: {
    flex: 1,
    color: cores.tinta,
    fontFamily: fonteSerifada,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  alternarVazias: {
    alignSelf: 'flex-start',
    marginBottom: espacos.md,
  },

  textoAlternar: {
    color: cores.receita,
    fontWeight: '700',
  },

  grupoVazio: {
    color: cores.tintaSuave,
    paddingVertical: espacos.sm,
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
    backgroundColor: cores.tinta,
    borderColor: cores.tinta,
  },

  textoChip: {
    color: cores.tinta,
    fontWeight: '600',
  },

  textoChipAtivo: {
    color: cores.papelCartao,
  },

  aviso: {
    color: cores.tintaSuave,
    marginBottom: espacos.md,
  },

  grupo: {
    backgroundColor: cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: espacos.md,
    marginBottom: espacos.md,
  },

  cabecalhoGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    paddingBottom: espacos.sm,
    marginBottom: espacos.xs,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  marca: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },

  textosGrupo: {
    flex: 1,
  },

  tituloGrupo: {
    color: cores.tinta,
    fontFamily: fonteSerifada,
    fontSize: 17,
    fontWeight: '700',
  },

  descricaoGrupo: {
    color: cores.tintaSuave,
    fontSize: 12,
  },

  totalGrupo: {
    color: cores.tinta,
    fontSize: 16,
    fontWeight: '700',
  },

  linha: {
    paddingVertical: espacos.sm,
    paddingHorizontal: espacos.xs,
    borderRadius: 8,
  },

  pressionado: {
    backgroundColor: cores.papel,
  },

  topoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },

  nome: {
    flex: 1,
    color: cores.tinta,
    fontSize: 15,
    fontWeight: '600',
  },

  valor: {
    color: cores.tinta,
    fontSize: 15,
    fontWeight: '700',
  },

  seta: {
    color: cores.tintaSuave,
    fontSize: 20,
    lineHeight: 20,
  },

  textoApagado: {
    color: cores.tintaSuave,
    fontWeight: '400',
  },

  trilho: {
    height: 8,
    backgroundColor: cores.papel,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: espacos.xs,
  },

  barra: {
    height: '100%',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  detalhe: {
    color: cores.tintaSuave,
    fontSize: 12,
    marginTop: espacos.xs,
  },
});
