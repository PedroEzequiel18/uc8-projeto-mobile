import * as SQLite from 'expo-sqlite';

import { ErroDoBanco } from '../erros/erros';

import type { Transacao } from '../types/Transacao';

import type { DadosNovaTransacao } from '../servicos/transacoes';

export interface Pendente extends DadosNovaTransacao {
  id: number;
}

interface LinhaTransacao {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  id_categoria: number;
  data: string;
}

let bancoAberto: Promise<SQLite.SQLiteDatabase> | undefined;

function banco(): Promise<SQLite.SQLiteDatabase> {
  if (bancoAberto === undefined) {
    bancoAberto = SQLite.openDatabaseAsync('transacoes.db').then(async (db) => {
      await db.execAsync(`
          CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            id_categoria INTEGER NOT NULL,
            data TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS pendentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            id_categoria INTEGER NOT NULL,
            data TEXT NOT NULL
          );
        `);

      return db;
    });
  }

  return bancoAberto;
}

function paraTransacao(linha: LinhaTransacao): Transacao {
  return {
    id: linha.id,
    nome: linha.nome,
    descricao: linha.descricao,
    valor: linha.valor,
    id_categoria: linha.id_categoria,
    data: linha.data,
  };
}

// Fila: o SQLite não aceita duas transações ao mesmo tempo na mesma conexão
// ("cannot start a transaction within a transaction"). Cada operação espera a
// anterior terminar, mesmo que a anterior tenha falhado.
let fila: Promise<unknown> = Promise.resolve();

function noBanco<T>(
  operacao: (db: SQLite.SQLiteDatabase) => Promise<T>,
): Promise<T> {
  const execucao = fila.then(async () => {
    try {
      const db = await banco();

      return await operacao(db);
    } catch (erro: unknown) {
      throw new ErroDoBanco(
        erro instanceof Error ? erro.message : String(erro),
      );
    }
  });

  fila = execucao.catch(() => undefined);

  return execucao;
}

export function listarLocal(): Promise<Transacao[]> {
  return noBanco(async (db) => {
    const linhas = await db.getAllAsync<LinhaTransacao>(
      `
        SELECT
          id,
          nome,
          descricao,
          valor,
          id_categoria,
          data
        FROM transacoes
        ORDER BY id
        `,
    );

    return linhas.map(paraTransacao);
  });
}

export function guardarLocal(transacoes: Transacao[]): Promise<void> {
  return noBanco((db) =>
    db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM transacoes');

      for (const transacao of transacoes) {
        await db.runAsync(
          `
              INSERT INTO transacoes (
                id,
                nome,
                descricao,
                valor,
                id_categoria,
                data
              )
              VALUES (?, ?, ?, ?, ?, ?)
              `,
          [
            transacao.id,
            transacao.nome,
            transacao.descricao,
            transacao.valor,
            transacao.id_categoria,
            transacao.data,
          ],
        );
      }
    }),
  );
}

export function contarLocal(): Promise<number> {
  return noBanco(async (db) => {
    const linha = await db.getFirstAsync<{
      total: number;
    }>(
      `
        SELECT COUNT(*) AS total
        FROM transacoes
        `,
    );

    return linha?.total ?? 0;
  });
}

export function listarPendentes(): Promise<Pendente[]> {
  return noBanco((db) =>
    db.getAllAsync<Pendente>(
      `
      SELECT
        id,
        nome,
        descricao,
        valor,
        id_categoria,
        data
      FROM pendentes
      ORDER BY id
      `,
    ),
  );
}

export function guardarPendente(dados: DadosNovaTransacao): Promise<Pendente> {
  return noBanco(async (db) => {
    const resultado = await db.runAsync(
      `
        INSERT INTO pendentes (
          nome,
          descricao,
          valor,
          id_categoria,
          data
        )
        VALUES (?, ?, ?, ?, ?)
        `,
      [
        dados.nome,
        dados.descricao,
        dados.valor,
        dados.id_categoria,
        dados.data,
      ],
    );

    return {
      id: resultado.lastInsertRowId,
      ...dados,
    };
  });
}

export function removerPendente(id: number): Promise<void> {
  return noBanco(async (db) => {
    await db.runAsync('DELETE FROM pendentes WHERE id = ?', [id]);
  });
}
