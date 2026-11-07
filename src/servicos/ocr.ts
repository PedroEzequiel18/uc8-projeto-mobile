// OCR via API OCR.space (https://ocr.space/ocrapi).
// Funciona no Expo Go: só usa fetch, sem código nativo de OCR.
// Chave grátis: cadastre o e-mail em https://ocr.space/ocrapi/freekey
// e coloque em .env.local como EXPO_PUBLIC_OCR_KEY.

import { File } from 'expo-file-system';

const URL_OCR = 'https://api.ocr.space/parse/image';

// Chave de demonstração pública (lenta e limitada). Use a sua em .env.local.
const CHAVE_DEMO = 'helloworld';

const TEMPO_LIMITE_MS = 60000;

// Limite do plano grátis do OCR.space.
const TAMANHO_MAXIMO = 1024 * 1024;

export interface ArquivoParaOcr {
  uri: string;
  nome: string;
  mimeType: string;
}

interface RespostaOcr {
  ParsedResults?: { ParsedText?: string }[];
  IsErroredOnProcessing?: boolean;
  ErrorMessage?: string | string[];
}

const ALFABETO =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesParaBase64(bytes: Uint8Array): string {
  const partes: string[] = [];

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;

    const trio = (a << 16) | (b << 8) | c;

    partes.push(
      ALFABETO[(trio >> 18) & 63] +
        ALFABETO[(trio >> 12) & 63] +
        (i + 1 < bytes.length ? ALFABETO[(trio >> 6) & 63] : '=') +
        (i + 2 < bytes.length ? ALFABETO[trio & 63] : '='),
    );
  }

  return partes.join('');
}

async function lerBytes(uri: string): Promise<Uint8Array> {
  try {
    const buffer = await new File(uri).arrayBuffer();

    return new Uint8Array(buffer);
  } catch (erro: unknown) {
    throw new Error(
      `Não foi possível ler o arquivo no aparelho: ${String(erro)}`,
    );
  }
}

export async function lerTextoDoArquivo(
  arquivo: ArquivoParaOcr,
): Promise<string> {
  const chave = process.env.EXPO_PUBLIC_OCR_KEY ?? CHAVE_DEMO;

  const bytes = await lerBytes(arquivo.uri);

  if (bytes.length > TAMANHO_MAXIMO) {
    const mb = (bytes.length / 1024 / 1024).toFixed(1);

    throw new Error(
      `Arquivo com ${mb} MB. O OCR grátis aceita até 1 MB — use um print do comprovante.`,
    );
  }

  const tipo = arquivo.mimeType.includes('pdf')
    ? 'application/pdf'
    : arquivo.mimeType;

  // Envia como formulário simples (sem multipart), mais confiável no Android.
  const campos: Record<string, string> = {
    apikey: chave,
    language: 'por',
    OCREngine: '2',
    scale: 'true',
    base64Image: `data:${tipo};base64,${bytesParaBase64(bytes)}`,
  };

  const corpoDoEnvio = Object.entries(campos)
    .map(
      ([nome, valor]) =>
        `${encodeURIComponent(nome)}=${encodeURIComponent(valor)}`,
    )
    .join('&');

  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  let resposta: Response;

  try {
    resposta = await fetch(URL_OCR, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: corpoDoEnvio,
      signal: controle.signal,
    });
  } catch (erro: unknown) {
    if (controle.signal.aborted) {
      throw new Error(
        'O OCR demorou demais para responder. Tente de novo (a chave demo é lenta; use sua chave grátis).',
      );
    }

    throw new Error(
      `Falha ao acessar o serviço de OCR: ${erro instanceof Error ? erro.message : String(erro)}`,
    );
  } finally {
    clearTimeout(temporizador);
  }

  if (!resposta.ok) {
    throw new Error(`O serviço de OCR respondeu ${resposta.status}.`);
  }

  const corpo = (await resposta.json()) as RespostaOcr;

  if (corpo.IsErroredOnProcessing) {
    const mensagem = Array.isArray(corpo.ErrorMessage)
      ? corpo.ErrorMessage.join(' ')
      : corpo.ErrorMessage;

    throw new Error(mensagem || 'O OCR não conseguiu ler o arquivo.');
  }

  const texto = (corpo.ParsedResults ?? [])
    .map((resultado) => resultado.ParsedText ?? '')
    .join('\n')
    .trim();

  if (texto === '') {
    throw new Error('Nenhum texto foi encontrado no arquivo.');
  }

  return texto;
}
