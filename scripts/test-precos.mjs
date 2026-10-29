// Regra 8 do guia: compara cada preço renderizado com o valor do relatório.
// Usa formatação independente da do site (Intl) para pegar erro no formatador.
// Falhou, não publica.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moedaEsperada = (v) => brl.format(Number(v)).replace(/ /g, ' ');
const dataHoraEsperada = (iso) =>
  new Date(iso)
    .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    .replace(', ', ' ');
const desescapar = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const relatorio = JSON.parse(await readFile(path.join(RAIZ, 'data', 'relatorio.json'), 'utf8'));

// Valores esperados: só ofertas ativas; parcelas só junto do preço à vista.
const esperado = new Map();
for (const o of relatorio.ofertas) {
  if (o.status !== 'ok' || !o.preco) continue;
  esperado.set(`${o.id}:avista`, moedaEsperada(o.preco.valor));
  if (o.parcelamento) esperado.set(`${o.id}:parcela`, moedaEsperada(o.parcelamento.valor));
}
const referencias = new Map();
for (const o of relatorio.ofertas) {
  if (o.status === 'ok' && o.referencia) referencias.set(`${o.id}:referencia`, moedaEsperada(o.referencia.valor));
}
const carimbos = new Map(relatorio.ofertas.map((o) => [o.id, dataHoraEsperada(o.checado_em)]));

// Histórico esperado, lido direto dos relatórios arquivados.
const historico = new Map();
const pastaArquivo = path.join(RAIZ, 'data', 'arquivo');
for (const nome of (await readdir(pastaArquivo).catch(() => [])).filter((f) => f.endsWith('.json'))) {
  const r = JSON.parse(await readFile(path.join(pastaArquivo, nome), 'utf8'));
  for (const o of r.ofertas || []) if (o.preco) historico.set(`${o.id}|${o.checado_em}`, moedaEsperada(o.preco.valor));
}
for (const o of relatorio.ofertas) if (o.status === 'ok' && o.preco) historico.set(`${o.id}|${o.checado_em}`, moedaEsperada(o.preco.valor));

async function htmls(dir) {
  const saida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...(await htmls(p)));
    else if (e.name.endsWith('.html')) saida.push(p);
  }
  return saida;
}

const falhas = [];
const vistos = new Map(); // chave -> arquivos onde apareceu
let conferidos = 0;
const PROIBIDOS = [/\bcorra\b/i, /imperd[ií]vel/i, /[úu]ltimas unidades/i, /voc[êe] merece/i, /\ba partir de\b/i, /!/];

for (const arquivo of await htmls(DIST)) {
  const rel = path.relative(DIST, arquivo).replace(/\\/g, '/');
  const html = await readFile(arquivo, 'utf8');

  const idsComPreco = new Set();
  for (const [, chave, texto] of html.matchAll(/data-preco="([^"]+)"[^>]*>([^<]*)</g)) {
    conferidos++;
    const id = chave.split(':')[0];
    idsComPreco.add(id);
    const alvo = esperado.get(chave) ?? referencias.get(chave);
    if (alvo === undefined) falhas.push(`${rel}: preço "${texto}" (${chave}) não corresponde a nenhum valor exibível do relatório`);
    else if (desescapar(texto) !== alvo) falhas.push(`${rel}: ${chave} renderizado "${texto}", relatório "${alvo}"`);
    if (!vistos.has(chave)) vistos.set(chave, new Set());
    vistos.get(chave).add(rel);
  }

  const idsComCarimbo = new Set();
  for (const [, id, texto] of html.matchAll(/data-carimbo="([^"]+)"[^>]*>([^<]*)</g)) {
    idsComCarimbo.add(id);
    if (texto !== carimbos.get(id)) falhas.push(`${rel}: carimbo de ${id} "${texto}", esperado "${carimbos.get(id)}"`);
  }
  for (const id of idsComPreco) if (!idsComCarimbo.has(id)) falhas.push(`${rel}: ${id} tem preço sem data e hora da checagem`);

  for (const [, chave, texto] of html.matchAll(/data-historico="([^"]+)"[^>]*>([^<]*)</g)) {
    conferidos++;
    const alvo = historico.get(desescapar(chave));
    if (alvo === undefined) falhas.push(`${rel}: histórico ${chave} sem registro nos relatórios`);
    else if (texto !== alvo) falhas.push(`${rel}: histórico ${chave} renderizado "${texto}", relatório "${alvo}"`);
  }

  const visivel = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const re of PROIBIDOS) if (re.test(desescapar(visivel))) falhas.push(`${rel}: texto visível com termo proibido pelo guia de tom (${re})`);
}

// Todo preço do relatório precisa aparecer na home, na categoria e na página da oferta.
for (const o of relatorio.ofertas) {
  if (o.status !== 'ok' || !o.preco) continue;
  const chave = `${o.id}:avista`;
  const onde = vistos.get(chave) || new Set();
  for (const pagina of ['index.html', `categoria/${o.categoria}/index.html`, `oferta/${o.id}/index.html`]) {
    if (!onde.has(pagina)) falhas.push(`${pagina}: preço de ${o.id} não foi renderizado`);
  }
}

if (falhas.length) {
  console.error(`\nTeste de preços FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error(`  - ${f}`);
  console.error('\nNada foi publicado.\n');
  process.exit(1);
}
console.log(`Teste de preços OK: ${conferidos} valores renderizados conferem com o relatório.`);
