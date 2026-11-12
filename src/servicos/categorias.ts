import type { Categoria } from '../types/Categoria';

import { requisitar } from './transacoes';

export interface DadosNovaCategoria {
  nome: string;
  tipo: Categoria['tipo'];
}

const TIPOS: Categoria['tipo'][] = ['receita', 'fixa', 'variavel'];

// Confere a forma do que a API devolveu, em vez de confiar nela.
function ehCategoria(valor: unknown): valor is Categoria {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const campos = valor as Record<string, unknown>;

  return (
    typeof campos.id === 'number' &&
    typeof campos.nome === 'string' &&
    typeof campos.tipo === 'string' &&
    TIPOS.some((tipo) => tipo === campos.tipo)
  );
}

function ehListaDeCategorias(valor: unknown): valor is Categoria[] {
  return Array.isArray(valor) && valor.every(ehCategoria);
}

export async function carregarCategorias(): Promise<Categoria[]> {
  const corpo = await requisitar('categorias?select=id,nome,tipo&order=id');

  if (!ehListaDeCategorias(corpo)) {
    throw new Error('Resposta inesperada da API');
  }

  return corpo;
}

export async function incluirCategoria(
  dados: DadosNovaCategoria,
): Promise<Categoria> {
  const corpo = await requisitar(
    'categorias?select=id,nome,tipo',
    'POST',
    dados,
  );

  if (!ehListaDeCategorias(corpo) || corpo.length !== 1) {
    throw new Error('Resposta inesperada da API');
  }

  return corpo[0];
}
