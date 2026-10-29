// Componentes e páginas da Atto. Todo valor vem do relatório; aqui só se formata.
import { dataHora, data, moeda, horasDesde } from './formato.mjs';

export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Ícones: traço de 1.5px em currentColor.
const TRACOS = {
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  confirmado: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/>',
  alerta: '<path d="M12 3.5 2.5 20h19L12 3.5z"/><path d="M12 10v4.5M12 17.5v.01"/>',
  comprar: '<path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>',
  esperar: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  sem_base: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  bandeira: '<path d="M5 21V4h12l-2.5 4L17 12H5"/>',
  tema: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
};
export function icone(nome) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${TRACOS[nome]}</svg>`;
}

const VEREDITO_ROTULO = { comprar: 'Comprar agora', esperar: 'Esperar', sem_base: 'Sem base suficiente' };
const EVIDENCIA_ROTULO = {
  pagina_produto: 'preço confirmado na página do produto',
  listagem_loja: 'preço confirmado na listagem da loja',
  busca_loja: 'preço lido no resultado de busca da loja, sem abrir a página. O buscador não informa quando viu esse preço, que pode ser anterior à checagem',
  agregador: 'preço lido em agregador de ofertas, não confirmado na loja. Pode ser anterior à checagem',
};
const VEREDITO_ICONE = { comprar: 'comprar', esperar: 'esperar', sem_base: 'sem_base' };

export const urlOferta = (o) => `/oferta/${o.id}/`;
export const urlCategoria = (c) => `/categoria/${c.id}/`;

// Contexto compartilhado pelos componentes.
export function criarContexto({ config, relatorio, arquivo, agora, versao }) {
  const categorias = new Map(relatorio.categorias.map((c) => [c.id, c]));
  return { config, relatorio, arquivo, agora, versao, categorias, limite: config.limite_desatualizado_horas };
}

function desatualizado(ctx, iso) {
  return horasDesde(iso, ctx.agora) > ctx.limite;
}

function plural(n, um, varios) {
  return `${n} ${n === 1 ? um : varios}`;
}

// ---------- Componentes ----------

function midia(o, { grande = false } = {}) {
  if (o.imagem) {
    return `<div class="midia"><img src="${esc(o.imagem)}" alt="Imagem de ${esc(o.nome)}, fornecida por ${esc(o.loja)}" loading="${grande ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer"></div>`;
  }
  return '';
}

function linhaLoja(o) {
  const partes = [`Loja: ${esc(o.loja)}`];
  partes.push(o.vendedor ? `vendido por ${esc(o.vendedor)}` : 'vendedor não informado');
  return `<p class="body-sm muted">${partes.join(' · ')}</p>`;
}

// Preço à vista, parcelas (só com o preço à vista) e referência de mercado.
function blocoPreco(o, { classe = 'price' } = {}) {
  if (o.status === 'encerrada') {
    return `<div class="preco-bloco"><p class="encerrada">Encerrada</p><p class="caption">Oferta encerrada na última checagem, em <span class="stamp">${dataHora(o.checado_em)}</span>.</p></div>`;
  }
  if (o.status === 'falha') return '';
  const linhas = [];
  if (o.preco) {
    linhas.push(`<p class="${classe}" data-preco="${esc(o.id)}:avista">${moeda(o.preco.valor)}</p>`);
    const condicao = o.preco.condicao ? esc(o.preco.condicao) : 'forma de pagamento não informada';
    let apoio = condicao;
    if (o.parcelamento) {
      const p = o.parcelamento;
      apoio += ` · ou ${p.quantidade}x de <span class="mono nowrap" data-preco="${esc(o.id)}:parcela">${moeda(p.valor)}</span> ${p.juros ? 'com juros' : 'sem juros'}`;
    }
    linhas.push(`<p class="body-sm muted">${apoio}</p>`);
  } else {
    linhas.push('<p class="body-sm sem-preco">Preço à vista não informado pela fonte. Sem ele, as parcelas não são exibidas.</p>');
  }
  if (o.referencia) {
    linhas.push(`<p class="data referencia">${esc(o.referencia.rotulo)}: <span class="mono nowrap" data-preco="${esc(o.id)}:referencia">${moeda(o.referencia.valor)}</span></p>`);
  }
  if (o.variacao) linhas.push(`<p class="data muted">${esc(o.variacao)}</p>`);
  return `<div class="preco-bloco">${linhas.join('')}</div>`;
}

function tagsFonte(o, { completo = false } = {}) {
  const tags = [];
  if (o.fonte_verificada) tags.push(`<span class="tag tag-verificada">${icone('confirmado')}Fonte verificada</span>`);
  else tags.push(`<span class="tag tag-nao-verificada">${icone('alerta')}Fonte não verificada</span>`);
  if (o.afiliado) tags.push(`<span class="tag tag-afiliado">${icone('link')}Link de afiliado</span>`);
  let html = `<div class="tags">${tags.join('')}</div>`;
  if (!o.fonte_verificada && completo) {
    html += `<div class="aviso aviso-risco">${icone('alerta')}<p class="body-sm"><span class="label rotulo">Fonte não verificada:</span> o risco da compra é do comprador. <a href="/sobre/#fontes">Veja o critério de fonte verificada</a>.</p></div>`;
  }
  return html;
}

// PriceStamp: atual, desatualizado (mais de 24 h) ou falha na coleta.
function carimbo(ctx, o) {
  const dh = dataHora(o.checado_em);
  if (o.status === 'falha') {
    return `<div class="aviso aviso-risco">${icone('alerta')}<p class="body-sm"><span class="label rotulo">Falha na coleta.</span> Tentativa em <span class="stamp">${dh}</span>. O preço não é exibido.</p></div>`;
  }
  if (o.status === 'encerrada') return '';
  const velho = desatualizado(ctx, o.checado_em);
  return `<div class="pilha-sm" data-checado="${esc(o.checado_em)}">
  <p class="carimbo stamp" data-estado="atual"${velho ? ' hidden' : ''}>${icone('relogio')}<span>Checado em <span data-carimbo="${esc(o.id)}">${dh}</span></span></p>
  <div class="aviso aviso-espera" data-estado="desatualizado"${velho ? '' : ' hidden'}>${icone('relogio')}<p class="body-sm"><span class="label rotulo">Dado desatualizado.</span> Última checagem em <span class="stamp" data-carimbo="${esc(o.id)}">${dh}</span>. O preço e o veredito podem ter mudado.</p></div>
  <p class="caption">Origem do preço: ${esc(o.checado_via)}${o.evidencia ? `; ${EVIDENCIA_ROTULO[o.evidencia]}` : ''}</p>
</div>`;
}

function veredito(o) {
  if (!o.veredito || o.status !== 'ok') return '';
  const v = o.veredito;
  return `<div class="veredito veredito-${v.tipo}">
  <p class="veredito-rotulo label">${icone(VEREDITO_ICONE[v.tipo])}${VEREDITO_ROTULO[v.tipo]}</p>
  <p class="body-sm">${esc(v.motivo)}</p>
  <p class="stamp">Base: ${esc(v.base)}</p>
</div>`;
}

function relAfiliado(o) {
  return o.afiliado ? 'noopener sponsored' : 'noopener';
}

export function linkReportar(ctx, o) {
  const email = ctx.config.contato_email;
  let href = '/sobre/#contato';
  if (email) {
    const preco = o.preco ? moeda(o.preco.valor) : 'sem preço à vista';
    const assunto = `Preço divergente: ${o.nome} (${o.id})`;
    const corpo = [
      `Oferta: ${o.nome}`,
      `Loja: ${o.loja}`,
      `Preço exibido na Atto: ${preco}, checado em ${dataHora(o.checado_em)}`,
      'Preço que você viu na loja:',
      'Data e hora em que viu:',
      'Link da página da loja:',
    ].join('\n');
    href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  }
  return `<a class="link-reportar" href="${esc(href)}">${icone('bandeira')}Reportar preço divergente</a>`;
}

function acoesCartao(ctx, o) {
  let botao = '';
  if (o.status === 'ok') {
    botao = o.url_produto
      ? `<a class="btn btn-principal btn-largo" href="${esc(o.url_produto)}" target="_blank" rel="${relAfiliado(o)}">Ver na loja${icone('externo')}<span class="sr-only"> (abre em nova aba)</span></a>`
      : `<a class="btn btn-secundario btn-largo" href="${urlOferta(o)}#como-chegar">Como chegar na oferta</a>`;
  }
  return `<div class="cartao-acoes">${botao}${linkReportar(ctx, o)}</div>`;
}

// OfferCard, na ordem fixa do guia.
export function cartao(ctx, o, ordem, { nivel = 3 } = {}) {
  const busca = [o.nome, o.especificacoes, o.loja, o.vendedor, o.codigo_modelo].filter(Boolean).join(' ').toLowerCase();
  const valor = o.status === 'ok' && o.preco ? o.preco.valor : '';
  return `<article class="cartao" data-oferta="${esc(o.id)}" data-ordem="${ordem}" data-loja="${esc(o.loja)}" data-verificada="${o.fonte_verificada ? 'sim' : 'nao'}" data-valor="${esc(valor)}" data-busca="${esc(busca)}">
  ${midia(o)}
  <div class="pilha-sm">
    <h${nivel} class="h3 cartao-titulo"><a href="${urlOferta(o)}">${esc(o.nome)}</a></h${nivel}>
    ${linhaLoja(o)}
  </div>
  ${blocoPreco(o)}
  ${o.status === 'ok' ? tagsFonte(o) : ''}
  ${carimbo(ctx, o)}
  ${veredito(o)}
  ${acoesCartao(ctx, o)}
</article>`;
}

function filtros(ofertas, alvo) {
  const lojas = [...new Set(ofertas.map((o) => o.loja))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  return `<form class="filtros" data-filtros="${alvo}" role="search" aria-label="Filtrar e ordenar ofertas" hidden>
  <div class="campo"><label class="label" for="f-busca">Buscar</label><input id="f-busca" type="search" data-f="busca" placeholder="Modelo, loja ou código" autocomplete="off"></div>
  <div class="campo"><label class="label" for="f-loja">Loja</label><select id="f-loja" data-f="loja"><option value="">Todas</option>${lojas.map((l) => `<option value="${esc(l)}">${esc(l)}</option>`).join('')}</select></div>
  <div class="campo"><label class="label" for="f-max">Preço à vista até (R$)</label><input id="f-max" type="text" inputmode="decimal" data-f="max" placeholder="Sem limite" autocomplete="off"></div>
  <div class="campo"><label class="label" for="f-ordem">Ordenar por</label><select id="f-ordem" data-f="ordem"><option value="relatorio">Ordem do relatório</option><option value="menor">Menor preço à vista</option><option value="maior">Maior preço à vista</option></select></div>
  <div class="linha-final">
    <label class="check body-sm"><input type="checkbox" data-f="verificada">Só fontes verificadas</label>
    <p class="caption" data-contagem aria-live="polite"></p>
  </div>
</form>`;
}

function falhaCategoria(c) {
  return `<div class="aviso aviso-risco falha-categoria">${icone('alerta')}<p class="body-sm"><span class="label rotulo">Falha na coleta de ${esc(c.nome.toLowerCase())}.</span> ${esc(c.motivo)} Nenhum preço desta categoria é exibido.</p></div>`;
}

function grade(ctx, c, ofertas, { nivel = 3 } = {}) {
  const partes = [];
  if (c.status === 'falha') partes.push(falhaCategoria(c));
  if (ofertas.length) {
    partes.push(`<div class="grade" data-grade>${ofertas.map((o, i) => cartao(ctx, o, i, { nivel })).join('')}</div>`);
    partes.push(`<p class="vazio body-sm" data-vazio-filtro hidden>Nenhuma oferta de ${esc(c.nome.toLowerCase())} com estes filtros.</p>`);
  } else if (c.status !== 'falha') {
    partes.push(`<p class="vazio body-sm">Nenhuma oferta de ${esc(c.nome.toLowerCase())} atendeu aos critérios neste relatório.</p>`);
  }
  return partes.join('');
}

function tituloCategoria(c, ofertas) {
  const checadas = ofertas.filter((o) => o.status === 'ok').length;
  return `${c.nome}: ${plural(checadas, 'oferta checada', 'ofertas checadas')}`;
}

function assinatura(ctx) {
  const r = ctx.relatorio;
  const ia = r.analise.apoio_ia
    ? '<p class="caption">Coleta e análise feitas com apoio de IA (Claude), a partir dos critérios e fontes definidos pelo autor. <a href="/sobre/#metodologia">Como funciona</a>.</p>'
    : '';
  return `<div class="assinatura secao"><p class="body-sm">Análise: ${esc(r.analise.autor)}</p>${ia}</div>`;
}

function blocoAtualizacao(ctx) {
  const r = ctx.relatorio;
  const dh = dataHora(r.gerado_em);
  const velho = desatualizado(ctx, r.gerado_em);
  return `<div class="atualizacao" data-checado="${esc(r.gerado_em)}">
  <p class="label muted">Última atualização do relatório</p>
  <p class="data" data-estado="atual"${velho ? ' hidden' : ''}>${dh}</p>
  <div class="aviso aviso-espera" data-estado="desatualizado"${velho ? '' : ' hidden'}>${icone('relogio')}<p class="body-sm"><span class="label rotulo">Relatório desatualizado.</span> A última atualização foi em <span class="stamp">${dh}</span>. Os preços abaixo podem ter mudado.</p></div>
  ${r.resumo ? `<p class="body-sm">${esc(r.resumo)}</p>` : ''}
</div>`;
}

// ---------- Layout ----------

export function layout(ctx, { titulo, descricao, caminho, conteudo, comOfertas = false, navAtual = '' }) {
  const { config, relatorio, versao } = ctx;
  const base = config.url_base ? config.url_base.replace(/\/$/, '') : '';
  const tituloCompleto = caminho === '/' ? `${config.nome}: ofertas de eletrônicos checadas` : `${titulo} | ${config.nome}`;
  const og = [
    ['og:type', 'website'],
    ['og:locale', 'pt_BR'],
    ['og:site_name', config.nome],
    ['og:title', caminho === '/' ? tituloCompleto : titulo],
    ['og:description', descricao],
  ];
  if (base) og.push(['og:url', base + caminho]);
  const analytics = config.cloudflare_analytics_token
    ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${esc(config.cloudflare_analytics_token)}"}'></script>`
    : '';
  const faixaAfiliados = config.afiliados && comOfertas
    ? `<div class="aviso-faixa"><div class="wrap"><p class="caption">Aviso de afiliados: alguns links para lojas podem ser de afiliado, marcados na oferta. Se você comprar por eles, a Atto pode receber comissão, sem custo extra para você. Isso não muda preço, ordem nem veredito. <a href="/afiliados/">Saiba mais</a>.</p></div></div>`
    : '';
  const faixaExemplo = relatorio.exemplo && comOfertas
    ? `<div class="wrap"><p class="aviso-exemplo body-sm" style="margin-top: var(--space-5)"><span class="label">Dados de exemplo.</span> Transcritos do relatório de ${data(relatorio.gerado_em)} para testar o site. Serão substituídos pela próxima execução da rotina.</p></div>`
    : '';
  const nav = (href, rotulo, chave) => `<a href="${href}"${navAtual === chave ? ' aria-current="page"' : ''}>${rotulo}</a>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(tituloCompleto)}</title>
<meta name="description" content="${esc(descricao)}">
${base ? `<link rel="canonical" href="${esc(base + caminho)}">` : ''}
${og.map(([p, c]) => `<meta property="${p}" content="${esc(c)}">`).join('\n')}
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#f6f6f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1412" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem('atto-tema');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=${versao}">
<script src="/app.js?v=${versao}" defer></script>
${analytics}
</head>
<body data-limite-horas="${ctx.limite}">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="wrap">
    <a class="marca" href="/">${esc(config.nome)}</a>
    <nav class="nav" aria-label="Principal">${nav('/', 'Ofertas', 'ofertas')}${nav('/sobre/', 'Sobre', 'sobre')}</nav>
    <button class="btn-tema" type="button" data-alternar-tema aria-label="Alternar tema">${icone('tema')}<span class="sr-only" data-tema-texto>Alternar tema</span></button>
  </div>
</header>
${faixaAfiliados}
${faixaExemplo}
<main id="conteudo">
<div class="wrap">
${conteudo}
</div>
</main>
<footer class="rodape">
  <div class="wrap">
    <nav aria-label="Rodapé"><ul>
      <li><a href="/sobre/">Sobre e metodologia</a></li>
      <li><a href="/sobre/#contato">Contato</a></li>
      <li><a href="/afiliados/">Aviso de afiliados</a></li>
      <li><a href="/privacidade/">Privacidade</a></li>
      <li><a href="/termos/">Termos de uso</a></li>
    </ul></nav>
    <p class="caption">Os preços são os do relatório, com a data e a hora da checagem. Lojas mudam preços a qualquer momento: confira o valor, o vendedor e o prazo na página da loja antes de pagar. A Atto pode errar; se encontrar um preço divergente, reporte.</p>
    <p class="caption">${esc(config.nome)}. Mantido por ${esc(config.assinatura)}.</p>
  </div>
</footer>
</body>
</html>
`;
}

// ---------- Páginas ----------

export function paginaInicial(ctx) {
  const { relatorio: r, config } = ctx;
  const comprar = r.ofertas.filter((o) => o.status === 'ok' && o.veredito?.tipo === 'comprar');
  const blocoComprar = comprar.length
    ? `<section class="secao" aria-labelledby="comprar-agora">
  <div class="secao-cabeca">
    <h2 id="comprar-agora">Comprar agora: ${plural(comprar.length, 'oferta', 'ofertas')}</h2>
    <p class="body-sm muted body">Ofertas com veredito "Comprar agora" neste relatório. Cada uma traz o motivo e a base da decisão.</p>
  </div>
  <div class="grade">${comprar.map((o, i) => cartao(ctx, o, i)).join('')}</div>
</section>`
    : `<section class="secao" aria-labelledby="comprar-agora">
  <div class="secao-cabeca"><h2 id="comprar-agora">Comprar agora: nenhuma oferta</h2></div>
  <p class="vazio body-sm">Nenhuma oferta deste relatório recebeu o veredito "Comprar agora". Quando o preço não justifica a compra, a Atto não força uma recomendação.</p>
</section>`;

  const secoes = r.categorias.map((c) => {
    const ofertas = r.ofertas.filter((o) => o.categoria === c.id);
    return `<section class="secao" aria-labelledby="cat-${esc(c.id)}">
  <div class="secao-cabeca">
    <h2 id="cat-${esc(c.id)}">${esc(tituloCategoria(c, ofertas))}</h2>
    ${c.criterio ? `<p class="body-sm muted body">Critério: ${esc(c.criterio)}</p>` : ''}
    <p class="body-sm"><a href="${urlCategoria(c)}">Abrir só ${esc(c.nome.toLowerCase())}</a></p>
  </div>
  ${grade(ctx, c, ofertas)}
</section>`;
  });

  const m = r.coleta?.metricas;
  const confirmadas = m?.por_evidencia ? (m.por_evidencia.pagina_produto || 0) + (m.por_evidencia.listagem_loja || 0) : null;
  const linhaMetricas = m && Number.isInteger(m.publicadas) && confirmadas !== null
    ? `<p class="body-sm">${confirmadas} de ${m.publicadas} ofertas com preço confirmado na página ou na listagem da própria loja${Number.isInteger(m.fonte_verificada) ? `; ${m.fonte_verificada} com fonte verificada` : ''}.</p>`
    : '';
  const notas = r.coleta?.notas?.length
    ? `<section class="secao">
  <details class="coleta">
    <summary>Como foi a coleta deste relatório</summary>
    <div class="conteudo pilha">
      ${linhaMetricas}
      <ul class="body-sm">${r.coleta.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      ${r.coleta.fontes_consultadas?.length ? `<p class="caption">Fontes consultadas: ${r.coleta.fontes_consultadas.map(esc).join(', ')}.</p>` : ''}
    </div>
  </details>
</section>`
    : '';

  const conteudo = `<section class="abertura">
  <h1 class="display">${esc(config.nome)}</h1>
  <p class="body">${esc(config.proposito)}</p>
  ${blocoAtualizacao(ctx)}
</section>
${blocoComprar}
<section class="secao" aria-labelledby="todas">
  <div class="secao-cabeca"><h2 id="todas">Todas as ofertas do relatório</h2></div>
  ${filtros(r.ofertas, '#lista-todas')}
</section>
<div id="lista-todas">
${secoes.join('\n')}
</div>
${notas}
${assinatura(ctx)}`;

  return layout(ctx, {
    titulo: config.nome,
    descricao: `${config.descricao} Relatório de ${dataHora(r.gerado_em)}.`,
    caminho: '/',
    conteudo,
    comOfertas: true,
    navAtual: 'ofertas',
  });
}

export function paginaCategoria(ctx, c) {
  const r = ctx.relatorio;
  const ofertas = r.ofertas.filter((o) => o.categoria === c.id);
  const titulo = tituloCategoria(c, ofertas);
  const conteudo = `<nav class="trilha body-sm" aria-label="Você está em"><ol><li><a href="/">Ofertas</a></li><li aria-current="page">${esc(c.nome)}</li></ol></nav>
<section class="abertura" style="padding-top: var(--space-6)">
  <h1>${esc(titulo)}</h1>
  ${c.criterio ? `<p class="body muted">Critério: ${esc(c.criterio)}</p>` : ''}
  ${blocoAtualizacao(ctx)}
</section>
<section class="secao" style="margin-top: var(--space-7)" aria-label="Filtros">
  ${ofertas.length ? filtros(ofertas, '#lista-categoria') : ''}
</section>
<div id="lista-categoria" class="secao" style="margin-top: var(--space-5)">
  ${grade(ctx, c, ofertas, { nivel: 2 })}
</div>
${assinatura(ctx)}`;
  return layout(ctx, {
    titulo,
    descricao: `${titulo}, com preço exato, data e hora da checagem. Relatório de ${dataHora(r.gerado_em)}.`,
    caminho: urlCategoria(c),
    conteudo,
    comOfertas: true,
    navAtual: 'ofertas',
  });
}

function comoChegar(o) {
  const textos = o.como_chegar.map((q, i) => `<div class="copiar">
    <p class="label" id="cc-${i}">${esc(q.rotulo)}</p>
    <div class="copiar-linha"><code aria-labelledby="cc-${i}">${esc(q.texto)}</code><button class="btn btn-secundario" type="button" data-copiar>Copiar</button></div>
  </div>`);
  return `<section class="secao como-chegar pilha" id="como-chegar" aria-labelledby="como-chegar-titulo">
  <h2 id="como-chegar-titulo">Como chegar na oferta</h2>
  <ol class="body-sm">
    <li>Copie um dos textos abaixo.</li>
    <li>Abra ${esc(o.loja)} e cole na busca da loja.</li>
    <li>Confira preço, vendedor e prazo antes de pagar.</li>
  </ol>
  ${textos.join('')}
  <a class="btn btn-secundario" href="${esc(o.url_loja)}" target="_blank" rel="${relAfiliado(o)}">Abrir ${esc(o.loja)}${icone('externo')}<span class="sr-only"> (abre em nova aba)</span></a>
</section>`;
}

function celulaPreco(o) {
  if (o.status === 'falha') return '<td>Falha na coleta</td>';
  if (o.status === 'encerrada') return '<td>Encerrada</td>';
  if (!o.preco) return '<td>Não informado</td>';
  return `<td class="num" data-preco="${esc(o.id)}:avista">${moeda(o.preco.valor)}</td>`;
}

function comparativo(ctx, o) {
  if (!o.codigo_modelo) return '';
  const mesmos = ctx.relatorio.ofertas.filter((x) => x.codigo_modelo === o.codigo_modelo);
  if (mesmos.length < 2) return '';
  const linhas = mesmos.map((x) => `<tr${x.id === o.id ? ' class="atual"' : ''}>
    <td>${x.id === o.id ? `${esc(x.loja)} <span class="caption">(esta oferta)</span>` : `<a href="${urlOferta(x)}">${esc(x.loja)}</a>`}</td>
    ${celulaPreco(x)}
    <td class="num" data-carimbo="${esc(x.id)}">${dataHora(x.checado_em)}</td>
    <td>${x.fonte_verificada ? 'Verificada' : 'Não verificada'}</td>
  </tr>`);
  return `<section class="secao pilha" aria-labelledby="comparativo">
  <h2 id="comparativo">Comparativo entre fontes</h2>
  <p class="body-sm muted body">Mesmo código do modelo (<span class="mono">${esc(o.codigo_modelo)}</span>) em outras lojas, neste relatório.</p>
  <div class="tabela-rolagem"><table>
    <thead><tr><th scope="col">Loja</th><th scope="col">Preço à vista</th><th scope="col">Checado em</th><th scope="col">Fonte</th></tr></thead>
    <tbody>${linhas.join('')}</tbody>
  </table></div>
</section>`;
}

function historico(ctx, o) {
  const pontos = ctx.arquivo.get(o.id) || [];
  if (!pontos.length) return '';
  const linhas = pontos
    .map((p) => `<tr><td class="num">${dataHora(p.checado_em)}</td>${p.valor ? `<td class="num" data-historico="${esc(o.id)}|${esc(p.checado_em)}">${moeda(p.valor)}</td>` : '<td>Não informado</td>'}<td>${esc(p.loja)}</td></tr>`)
    .join('');
  const nota = pontos.length === 1
    ? `<p class="caption">O histórico desta oferta começa em ${data(pontos[0].checado_em)}. Cada execução da rotina acrescenta uma checagem.</p>`
    : '';
  return `<section class="secao pilha" aria-labelledby="historico">
  <h2 id="historico">Histórico de preço</h2>
  <p class="body-sm muted body">Preço à vista em cada checagem registrada pela Atto, do mais recente para o mais antigo.</p>
  <div class="tabela-rolagem"><table>
    <thead><tr><th scope="col">Checado em</th><th scope="col">Preço à vista</th><th scope="col">Loja</th></tr></thead>
    <tbody>${linhas}</tbody>
  </table></div>
  ${nota}
</section>`;
}

export function paginaOferta(ctx, o) {
  const c = ctx.categorias.get(o.categoria);
  let botao = '';
  if (o.status === 'ok') {
    botao = o.url_produto
      ? `<a class="btn btn-principal" href="${esc(o.url_produto)}" target="_blank" rel="${relAfiliado(o)}">Ver na loja${icone('externo')}<span class="sr-only"> (abre em nova aba)</span></a>`
      : `<a class="btn btn-principal" href="#como-chegar">Como chegar na oferta</a>`;
  }
  const detalhes = [
    o.especificacoes ? `<p class="body-sm muted">${esc(o.especificacoes)}</p>` : '',
    linhaLoja(o),
    o.codigo_modelo ? `<p class="body-sm muted">Código do modelo: <span class="mono">${esc(o.codigo_modelo)}</span></p>` : '',
  ].join('');
  const temImagem = Boolean(o.imagem);
  const painel = `<div class="produto-painel">
    <div class="pilha-sm"><h1 class="h2">${esc(o.nome)}</h1>${detalhes}</div>
    ${blocoPreco(o, { classe: 'price-xl' })}
    ${o.status === 'ok' ? tagsFonte(o, { completo: true }) : ''}
    ${carimbo(ctx, o)}
    ${veredito(o)}
    ${o.afiliado ? '<p class="caption">Este é um link de afiliado: a Atto pode receber comissão se você comprar por ele, sem custo extra para você.</p>' : ''}
    <div class="produto-acoes">${botao}</div>
    ${linkReportar(ctx, o)}
  </div>`;
  const conteudo = `<nav class="trilha body-sm" aria-label="Você está em"><ol><li><a href="/">Ofertas</a></li><li><a href="${urlCategoria(c)}">${esc(c.nome)}</a></li><li aria-current="page">${esc(o.loja)}</li></ol></nav>
<div class="produto"${temImagem ? '' : ' style="grid-template-columns: minmax(0, 1fr); max-width: 760px"'}>
  ${temImagem ? `<div>${midia(o, { grande: true })}</div>` : ''}
  ${painel}
</div>
<div style="max-width: 760px">
${o.como_chegar.length ? comoChegar(o) : ''}
${comparativo(ctx, o)}
${historico(ctx, o)}
${assinatura(ctx)}
</div>`;
  const preco = o.status === 'ok' && o.preco ? `${moeda(o.preco.valor)} ${o.preco.condicao || ''} na ${o.loja}`.replace(/\s+/g, ' ') : `${o.loja}, sem preço à vista exibido`;
  return layout(ctx, {
    titulo: o.nome,
    descricao: `${preco}, checado em ${dataHora(o.checado_em)}.`,
    caminho: urlOferta(o),
    conteudo,
    comOfertas: true,
    navAtual: 'ofertas',
  });
}

export function paginaTexto(ctx, { titulo, descricao, caminho, corpo, navAtual = '' }) {
  return layout(ctx, {
    titulo,
    descricao,
    caminho,
    navAtual,
    conteudo: `<article class="texto" style="padding-top: var(--space-8)"><h1>${esc(titulo)}</h1>${corpo}</article>`,
  });
}
