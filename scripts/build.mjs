// Gera o site em dist/ a partir de data/relatorio.json.
// Relatório inválido interrompe o build: o Cloudflare mantém a versão anterior no ar.
import { readFile, writeFile, mkdir, rm, readdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validarRelatorio } from '../src/validar.mjs';
import { criarContexto, paginaInicial, paginaCategoria, paginaOferta, urlOferta, urlCategoria } from '../src/render.mjs';
import { paginaSobre, paginaAfiliados, paginaPrivacidade, paginaTermos, pagina404 } from '../src/paginas.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const ARQUIVO = path.join(RAIZ, 'data', 'arquivo');

const lerJson = async (rel) => JSON.parse(await readFile(path.join(RAIZ, rel), 'utf8'));

function falhar(titulo, erros) {
  console.error(`\n${titulo}`);
  for (const e of erros) console.error(`  - ${e}`);
  console.error('\nNada foi publicado.\n');
  process.exit(1);
}

const config = await lerJson('site.config.json');
// No GitHub Pages o site fica em um subcaminho (usuario.github.io/atto/). O workflow
// informa o endereço em ATTO_URL_BASE; os links internos recebem o prefixo no fim do build.
config.url_base = (process.env.ATTO_URL_BASE || config.url_base || '').replace(/\/$/, '');
const caminhoBase = config.url_base ? new URL(config.url_base).pathname.replace(/\/$/, '') : '';
const relatorio = await lerJson('data/relatorio.json');
const erros = validarRelatorio(relatorio);
if (erros.length) falhar(`Relatório inválido (${erros.length} erro(s)):`, erros);

// Histórico: cada checagem registrada nos relatórios arquivados, mais a atual.
const arquivo = new Map();
const avisos = [];
function registrar(r) {
  for (const o of r.ofertas) {
    if (o.status !== 'ok') continue;
    const pontos = arquivo.get(o.id) || [];
    if (!pontos.some((p) => p.checado_em === o.checado_em)) {
      pontos.push({ checado_em: o.checado_em, valor: o.preco ? o.preco.valor : null, loja: o.loja });
    }
    arquivo.set(o.id, pontos);
  }
}
const arquivados = (await readdir(ARQUIVO).catch(() => [])).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
for (const nome of arquivados) {
  const r = await lerJson(path.join('data', 'arquivo', nome));
  const errosArquivo = validarRelatorio(r);
  if (errosArquivo.length) {
    avisos.push(`data/arquivo/${nome} ignorado no histórico: ${errosArquivo[0]}`);
    continue;
  }
  registrar(r);
}
registrar(relatorio);
for (const pontos of arquivo.values()) pontos.sort((a, b) => Date.parse(b.checado_em) - Date.parse(a.checado_em));

if (!config.contato_email) avisos.push('contato_email vazio em site.config.json: "Reportar preço divergente" leva à página de contato, sem e-mail.');

const css = await readFile(path.join(RAIZ, 'src', 'styles.css'), 'utf8');
const js = await readFile(path.join(RAIZ, 'src', 'app.js'), 'utf8');
const versao = createHash('sha256').update(css).update(js).digest('hex').slice(0, 10);

const ctx = criarContexto({ config, relatorio, arquivo, agora: Date.now(), versao });

await rm(DIST, { recursive: true, force: true });
const paginas = [];
async function escrever(caminho, html) {
  const destino = caminho.endsWith('.html') ? path.join(DIST, caminho) : path.join(DIST, caminho, 'index.html');
  await mkdir(path.dirname(destino), { recursive: true });
  if (caminhoBase) html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${caminhoBase}/`);
  await writeFile(destino, html, 'utf8');
  if (!caminho.endsWith('.html')) paginas.push(caminho);
}

await escrever('/', paginaInicial(ctx));
for (const c of relatorio.categorias) await escrever(urlCategoria(c), paginaCategoria(ctx, c));
for (const o of relatorio.ofertas) await escrever(urlOferta(o), paginaOferta(ctx, o));
await escrever('/sobre/', paginaSobre(ctx));
await escrever('/afiliados/', paginaAfiliados(ctx));
await escrever('/privacidade/', paginaPrivacidade(ctx));
await escrever('/termos/', paginaTermos(ctx));
await escrever('404.html', pagina404(ctx));

await writeFile(path.join(DIST, 'styles.css'), css, 'utf8');
await writeFile(path.join(DIST, 'app.js'), js, 'utf8');
for (const f of ['favicon.svg', '_headers', 'robots.txt']) await copyFile(path.join(RAIZ, 'public', f), path.join(DIST, f));

if (config.url_base) {
  const base = config.url_base.replace(/\/$/, '');
  const urls = paginas.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n');
  await writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
  await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`, 'utf8');
}

for (const a of avisos) console.warn(`Aviso: ${a}`);
console.log(`Build concluído: ${paginas.length + 1} páginas, ${relatorio.ofertas.length} ofertas, relatório de ${relatorio.gerado_em}.`);
