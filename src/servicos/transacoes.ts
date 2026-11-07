import type { Transacao } from '../types/Transacao';

export interface DadosNovaTransacao {
  nome: string;
  descricao: string;
  valor: number;
  id_categoria: number;
  data: string;
}

export class ErroDaApi extends Error {
  constructor(
    mensagem: string,
    public readonly status: number,
  ) {
    super(mensagem);
  }
}

interface TransacaoRemota {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  id_categoria: number;
  data: string;
}

function configuracao(): {
  url: string;
  chave: string;
} {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;

  const chave = process.env.EXPO_PUBLIC_SUPABASE_KEY;

  if (url === undefined || chave === undefined) {
    throw new Error(
      'Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_KEY em .env.local',
    );
  }

  return {
    url,
    chave,
  };
}

export function descreverErro(erro: unknown): string {
  if (erro instanceof Error) {
    return erro.message;
  }

  return String(erro);
}

function ehTransacaoRemota(valor: unknown): valor is TransacaoRemota {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const campos = valor as Record<string, unknown>;

  return (
    typeof campos.id === 'number' &&
    typeof campos.nome === 'string' &&
    typeof campos.descricao === 'string' &&
    typeof campos.valor === 'number' &&
    typeof campos.id_categoria === 'number' &&
    typeof campos.data === 'string'
  );
}

function ehListaDeTransacoes(valor: unknown): valor is TransacaoRemota[] {
  return Array.isArray(valor) && valor.every(ehTransacaoRemota);
}

async function requisitar(
  caminho: string,
  metodo: 'GET' | 'POST' | 'DELETE' | 'PATCH' = 'GET',
  corpo?: DadosNovaTransacao,
): Promise<unknown> {
  const { url, chave } = configuracao();

  const resposta = await fetch(`${url}/rest/v1/${caminho}`, {
    method: metodo,
    headers: {
      apikey: chave,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (!resposta.ok) {
    throw new ErroDaApi(`A API respondeu ${resposta.status}`, resposta.status);
  }

  const texto = await resposta.text();

  if (texto === '') {
    return null;
  }

  return JSON.parse(texto);
}

export async function carregarTransacoes(): Promise<Transacao[]> {
  const corpo = await requisitar('transacoes?select=*&order=id');

  if (!ehListaDeTransacoes(corpo)) {
    throw new Error('Resposta inesperada da API');
  }

  return corpo;
}

export async function incluirTransacao(
  dados: DadosNovaTransacao,
): Promise<Transacao> {
  const corpo = await requisitar('transacoes?select=*', 'POST', dados);

  if (!ehListaDeTransacoes(corpo) || corpo.length !== 1) {
    throw new Error('Resposta inesperada da API');
  }

  return corpo[0];
}

export async function atualizarTransacao(
  id: number,
  dados: DadosNovaTransacao,
): Promise<Transacao> {
  const corpo = await requisitar(
    `transacoes?id=eq.${id}&select=*`,
    'PATCH',
    dados,
  );

  // Se a policy de UPDATE bloquear, o Supabase responde 200 com lista vazia.
  if (!ehListaDeTransacoes(corpo) || corpo.length !== 1) {
    throw new Error(
      'A transação não foi atualizada no banco (verifique a policy de UPDATE).',
    );
  }

  return corpo[0];
}

export async function removerTransacao(id: number): Promise<void> {
  await requisitar(`transacoes?id=eq.${id}`, 'DELETE');
}
