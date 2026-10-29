// Formatação de valores do relatório. Só formata: nunca arredonda nem recalcula.

const FUSO = 'America/Sao_Paulo';

const partesDataHora = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function partes(iso) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) throw new Error(`Data inválida: ${iso}`);
  return Object.fromEntries(partesDataHora.formatToParts(data).map((p) => [p.type, p.value]));
}

// "2026-10-29T14:32:00-03:00" -> "29/10/2026 14:32" (horário de Brasília)
export function dataHora(iso) {
  const p = partes(iso);
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

// "2026-10-29T14:32:00-03:00" -> "29/10/2026"
export function data(iso) {
  const p = partes(iso);
  return `${p.day}/${p.month}/${p.year}`;
}

// "1234.56" -> "R$ 1.234,56". Recebe a string do relatório e só troca separadores.
export function moeda(valor) {
  const m = /^(\d+)\.(\d{2})$/.exec(valor);
  if (!m) throw new Error(`Valor fora do formato "1234.56": ${valor}`);
  const inteiro = m[1].replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${inteiro},${m[2]}`;
}

export function horasDesde(iso, agora = Date.now()) {
  return (agora - new Date(iso).getTime()) / 3_600_000;
}
