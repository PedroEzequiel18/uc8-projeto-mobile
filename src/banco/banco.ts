import * as SQLite from 'expo-sqlite';

import type { Transacao } from '../types/Transacao';

interface LinhaTransacao {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  id_categoria: number;
  data: string;
}

let bancoAberto:
  | Promise<SQLite.SQLiteDatabase>
  | undefined;

function banco(): Promise<SQLite.SQLiteDatabase> {
  if (bancoAberto === undefined) {
    bancoAberto =
      SQLite.openDatabaseAsync(
        'transacoes.db',
      ).then(async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY NOT NULL,
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

function paraTransacao(
  linha: LinhaTransacao,
): Transacao {
  return {
    id: linha.id,
    nome: linha.nome,
    descricao: linha.descricao,
    valor: linha.valor,
    id_categoria:
      linha.id_categoria,
    data: linha.data,
  };
}

export async function listarLocal(): Promise<
  Transacao[]
> {
  const db = await banco();

  const linhas =
    await db.getAllAsync<LinhaTransacao>(
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
}

export async function guardarLocal(
  transacoes: Transacao[],
): Promise<void> {
  const db = await banco();

  await db.withTransactionAsync(
    async () => {
      await db.runAsync(
        'DELETE FROM transacoes',
      );

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
    },
  );
}

export async function contarLocal(): Promise<number> {
  const db = await banco();

  const linha =
    await db.getFirstAsync<{
      total: number;
    }>(
      `
      SELECT COUNT(*) AS total
      FROM transacoes
      `,
    );

  return linha?.total ?? 0;
}