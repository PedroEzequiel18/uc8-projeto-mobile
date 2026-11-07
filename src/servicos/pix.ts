// Extrai valor, data e nome do texto de um comprovante PIX.

export interface DadosPix {
  valor?: number;
  data?: string; // aaaa-mm-dd
  nome?: string;
}

const MESES: Record<string, string> = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12',
};

// "1.234,56" -> 1234.56
function converterValor(texto: string): number {
  return Number(texto.replace(/\./g, '').replace(',', '.'));
}

function extrairValor(texto: string): number | undefined {
  // Preferência: valor com "R$" na frente.
  const comCifrao = /R\s?\$\s*(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/i.exec(
    texto,
  );

  if (comCifrao) {
    return converterValor(comCifrao[1]);
  }

  // Alternativa: número depois da palavra "valor".
  const depoisDeValor =
    /valor[^\d]{0,20}(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/i.exec(texto);

  if (depoisDeValor) {
    return converterValor(depoisDeValor[1]);
  }

  return undefined;
}

function montarData(dia: string, mes: string, ano: string): string | undefined {
  const anoCompleto = ano.length === 2 ? `20${ano}` : ano;
  const diaFormatado = dia.padStart(2, '0');

  const data = new Date(
    Number(anoCompleto),
    Number(mes) - 1,
    Number(diaFormatado),
  );

  if (
    data.getFullYear() !== Number(anoCompleto) ||
    data.getMonth() !== Number(mes) - 1 ||
    data.getDate() !== Number(diaFormatado)
  ) {
    return undefined;
  }

  return `${anoCompleto}-${mes}-${diaFormatado}`;
}

function extrairData(texto: string): string | undefined {
  // 07/11/2026 ou 07/11/26 (usa a primeira data válida)
  for (const numerica of texto.matchAll(
    /\b(\d{2})\/(\d{2})\/(\d{4}|\d{2})\b/g,
  )) {
    const data = montarData(numerica[1], numerica[2], numerica[3]);

    if (data) {
      return data;
    }
  }

  // 07 NOV 2026, 7 de novembro de 2026, 07 nov. 2026
  const porExtenso =
    /\b(\d{1,2})\s*(?:de\s+)?(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[a-zç]*\.?\s*(?:de\s+)?(\d{4})\b/i.exec(
      texto,
    );

  if (porExtenso) {
    const mes = MESES[porExtenso[2].toLowerCase()];

    return montarData(porExtenso[1], mes, porExtenso[3]);
  }

  return undefined;
}

// Rótulos que aparecem antes do nome de quem recebeu o PIX.
const ROTULO_DESTINO =
  /^(para|destino|destinat[aá]rio|quem recebeu|recebedor|favorecido|dados de quem recebeu)\b[:\s]*/i;

const SO_ROTULO = /^(nome|para|de|:)?$/i;

function extrairNome(texto: string): string | undefined {
  const linhas = texto
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter((linha) => linha !== '');

  for (let i = 0; i < linhas.length; i++) {
    const rotulo = ROTULO_DESTINO.exec(linhas[i]);

    if (!rotulo) {
      continue;
    }

    // Nome na mesma linha: "Para: Fulano de Tal"
    const resto = linhas[i]
      .slice(rotulo[0].length)
      .replace(/^nome[:\s]*/i, '')
      .trim();

    if (resto.length > 2) {
      return resto;
    }

    // Nome na linha seguinte (pulando rótulos como "Nome").
    for (let j = i + 1; j < Math.min(i + 4, linhas.length); j++) {
      const candidata = linhas[j].replace(/^nome[:\s]*/i, '').trim();

      if (!SO_ROTULO.test(candidata) && /[a-zà-ú]/i.test(candidata)) {
        return candidata;
      }
    }
  }

  return undefined;
}

export function extrairDadosPix(texto: string): DadosPix {
  return {
    valor: extrairValor(texto),
    data: extrairData(texto),
    nome: extrairNome(texto),
  };
}
