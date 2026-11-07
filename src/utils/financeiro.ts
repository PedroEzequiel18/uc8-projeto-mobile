import { categorias } from '../dados/categorias';

import type { Transacao } from '../types/Transacao';

export interface Totais {
  receitas: number;
  despesas: number;
  saldo: number;
  movimentado: number;
  quantidade: number;
}

export function ehReceita(transacao: Transacao): boolean {
  const categoria = categorias.find((c) => c.id === transacao.id_categoria);

  return categoria?.tipo === 'receita';
}

export function calcularTotais(transacoes: Transacao[]): Totais {
  let receitas = 0;
  let despesas = 0;

  for (const transacao of transacoes) {
    if (ehReceita(transacao)) {
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

// Transações do mês atual ("aaaa-mm" igual ao de hoje).
export function doMesAtual(transacoes: Transacao[]): Transacao[] {
  const hoje = new Date();
  const mes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  return transacoes.filter((t) => t.data.slice(0, 7) === mes);
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

export function nomeDoMesAtual(): string {
  const hoje = new Date();

  return `${NOMES_MESES[hoje.getMonth()]} de ${hoje.getFullYear()}`;
}
