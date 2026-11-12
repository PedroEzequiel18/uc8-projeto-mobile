import type { Categoria } from '../types/Categoria';

import type { Transacao } from '../types/Transacao';

export interface Totais {
  receitas: number;
  despesas: number;
  saldo: number;
  movimentado: number;
  quantidade: number;
}

export function ehReceita(
  transacao: Transacao,
  categorias: Categoria[],
): boolean {
  const categoria = categorias.find((c) => c.id === transacao.id_categoria);

  return categoria?.tipo === 'receita';
}

export function calcularTotais(
  transacoes: Transacao[],
  categorias: Categoria[],
): Totais {
  let receitas = 0;
  let despesas = 0;

  for (const transacao of transacoes) {
    if (ehReceita(transacao, categorias)) {
      receitas += transacao.valor;
    } else {
      despesas += transacao.valor;
    }
  }

  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
    movimentado: receitas + despesas,
    quantidade: transacoes.length,
  };
}

// Transações de um mês (mes de 0 a 11), comparando "aaaa-mm".
export function doMes(
  transacoes: Transacao[],
  ano: number,
  mes: number,
): Transacao[] {
  const alvo = `${ano}-${String(mes + 1).padStart(2, '0')}`;

  return transacoes.filter((t) => t.data.slice(0, 7) === alvo);
}

// Transações do mês atual.
export function doMesAtual(transacoes: Transacao[]): Transacao[] {
  const hoje = new Date();

  return doMes(transacoes, hoje.getFullYear(), hoje.getMonth());
}

// 1234.5 -> "R$ 1.234,50" (sem depender de Intl).
export function formatarMoeda(valor: number): string {
  const negativo = valor < 0;
  const [inteiro, centavos] = Math.abs(valor).toFixed(2).split('.');
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${negativo ? '-' : ''}R$ ${comPontos},${centavos}`;
}

const NOMES_MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

// Ex.: nomeDoMes(2026, 10) -> "novembro de 2026"
export function nomeDoMes(ano: number, mes: number): string {
  return `${NOMES_MESES[mes]} de ${ano}`;
}

export function nomeDoMesAtual(): string {
  const hoje = new Date();

  return nomeDoMes(hoje.getFullYear(), hoje.getMonth());
}
