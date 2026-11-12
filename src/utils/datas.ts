// Datas são salvas como "aaaa-mm-dd" e exibidas como "dd/mm/aaaa".
// Tudo em horário LOCAL: toISOString() usa UTC e, no Brasil,
// depois das 21h devolveria a data de amanhã.

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

// Date -> "aaaa-mm-dd"
export function dateParaIso(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

// "aaaa-mm-dd" -> Date (meia-noite local)
export function isoParaDate(iso: string): Date {
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number);

  return new Date(ano, mes - 1, dia);
}

export function hojeIso(): string {
  return dateParaIso(new Date());
}

// "aaaa-mm-dd" -> "dd/mm/aaaa" (devolve como veio se não reconhecer)
export function dataParaTexto(data: string): string {
  if (data.includes('/')) {
    return data;
  }

  const [ano, mes, dia] = data.slice(0, 10).split('-');

  if (!ano || !mes || !dia) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;
}

// "1.234,56" | "1234,56" | "1234.56" -> número (NaN se inválido)
export function textoParaValor(texto: string): number {
  const limpo = texto.trim().replace(/^R\$\s*/i, '');

  if (limpo === '') {
    return NaN;
  }

  if (limpo.includes(',')) {
    return Number(limpo.replace(/\./g, '').replace(',', '.'));
  }

  // "1.000" ou "12.500.000": ponto como separador de milhar.
  if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    return Number(limpo.replace(/\./g, ''));
  }

  return Number(limpo);
}

// Primeiro e último dia de um mês (mes de 0 a 11), em "aaaa-mm-dd".
export function limitesDoMes(
  ano: number,
  mes: number,
): { inicio: string; fim: string } {
  return {
    inicio: dateParaIso(new Date(ano, mes, 1)),
    fim: dateParaIso(new Date(ano, mes + 1, 0)),
  };
}

// Primeiro e último dia do mês atual, em "aaaa-mm-dd".
export function limitesDoMesAtual(): { inicio: string; fim: string } {
  const hoje = new Date();

  return limitesDoMes(hoje.getFullYear(), hoje.getMonth());
}
