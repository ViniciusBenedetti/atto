// Valida o relatório antes de gerar o site. Qualquer erro impede a publicação.
// O contrato completo está em docs/RELATORIO.md.

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const VALOR = /^\d+\.\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HTTPS = /^https:\/\/[^\s]+$/;

// Termos proibidos pelo guia de tom (CLAUDE.md, "Tom de voz e conteúdo").
const PROIBIDOS = [
  /\bcorra\b/i,
  /imperd[ií]vel/i,
  /[úu]ltimas unidades/i,
  /voc[êe] merece/i,
  /\ba partir de\b/i,
  /!/,
  /\p{Extended_Pictographic}/u,
];

const STATUS_CATEGORIA = ['ok', 'falha'];
const STATUS_OFERTA = ['ok', 'falha', 'encerrada'];
const VEREDITOS = ['comprar', 'esperar', 'sem_base'];
// Níveis de evidência de docs/PROCESSO-COLETA.md. Só os dois primeiros sustentam "comprar".
const EVIDENCIAS = ['pagina_produto', 'listagem_loja', 'busca_loja', 'agregador'];
const EVIDENCIAS_COMPRA = ['pagina_produto', 'listagem_loja'];
const ACESSOS = ['ok', 'bloqueado', 'erro'];

export function validarRelatorio(r) {
  const erros = [];
  const erro = (onde, msg) => erros.push(`${onde}: ${msg}`);
  const texto = (onde, v, { opcional = false } = {}) => {
    if (v === null || v === undefined) {
      if (!opcional) erro(onde, 'obrigatório');
      return;
    }
    if (typeof v !== 'string' || !v.trim()) return erro(onde, 'deve ser texto não vazio');
    for (const re of PROIBIDOS) if (re.test(v)) erro(onde, `termo proibido pelo guia de tom (${re}) em "${v}"`);
  };
  const iso = (onde, v) => {
    if (typeof v !== 'string' || !ISO.test(v) || Number.isNaN(Date.parse(v))) erro(onde, `data ISO 8601 com fuso esperada, recebido ${JSON.stringify(v)}`);
  };
  const valor = (onde, v) => {
    if (typeof v !== 'string' || !VALOR.test(v)) erro(onde, `valor em texto no formato "1234.56" esperado, recebido ${JSON.stringify(v)}`);
  };
  const bool = (onde, v) => {
    if (typeof v !== 'boolean') erro(onde, 'deve ser true ou false');
  };
  const url = (onde, v, { opcional = false } = {}) => {
    if (v === null && opcional) return;
    if (typeof v !== 'string' || !HTTPS.test(v)) erro(onde, `URL https esperada, recebido ${JSON.stringify(v)}`);
  };

  if (!r || typeof r !== 'object') return ['relatório: não é um objeto JSON'];
  if (r.schema !== 1) erro('schema', 'deve ser 1');
  // Versão do processo de coleta (docs/PROCESSO-COLETA.md). A partir da 2, evidência e métricas são obrigatórias.
  const processo = r.processo ?? 1;
  if (![1, 2].includes(processo)) erro('processo', 'deve ser 1 ou 2');
  const v2 = processo >= 2;
  if (v2 && (!r.coleta || !r.coleta.metricas)) erro('coleta.metricas', 'obrigatório a partir do processo 2');
  iso('gerado_em', r.gerado_em);
  texto('resumo', r.resumo, { opcional: true });
  if (!r.analise || typeof r.analise !== 'object') erro('analise', 'obrigatório');
  else {
    texto('analise.autor', r.analise.autor);
    bool('analise.apoio_ia', r.analise.apoio_ia);
  }

  const categorias = new Set();
  if (!Array.isArray(r.categorias) || r.categorias.length === 0) erro('categorias', 'lista não vazia obrigatória');
  else
    r.categorias.forEach((c, i) => {
      const onde = `categorias[${i}]`;
      if (typeof c.id !== 'string' || !SLUG.test(c.id)) erro(`${onde}.id`, 'slug em minúsculas com hífens');
      else if (categorias.has(c.id)) erro(`${onde}.id`, `repetido: ${c.id}`);
      else categorias.add(c.id);
      texto(`${onde}.nome`, c.nome);
      texto(`${onde}.criterio`, c.criterio, { opcional: true });
      if (!STATUS_CATEGORIA.includes(c.status)) erro(`${onde}.status`, `um de ${STATUS_CATEGORIA.join(', ')}`);
      if (c.status === 'falha') texto(`${onde}.motivo`, c.motivo);
    });

  const ids = new Set();
  if (!Array.isArray(r.ofertas)) erro('ofertas', 'lista obrigatória (pode ser vazia)');
  else
    r.ofertas.forEach((o, i) => {
      const onde = `ofertas[${i}]${typeof o.id === 'string' ? ` (${o.id})` : ''}`;
      if (typeof o.id !== 'string' || !SLUG.test(o.id)) erro(`${onde}.id`, 'slug em minúsculas com hífens');
      else if (ids.has(o.id)) erro(`${onde}.id`, 'repetido');
      else ids.add(o.id);
      if (!categorias.has(o.categoria)) erro(`${onde}.categoria`, `não existe em categorias: ${o.categoria}`);
      texto(`${onde}.nome`, o.nome);
      texto(`${onde}.especificacoes`, o.especificacoes, { opcional: true });
      texto(`${onde}.codigo_modelo`, o.codigo_modelo, { opcional: true });
      url(`${onde}.imagem`, o.imagem, { opcional: true });
      texto(`${onde}.loja`, o.loja);
      texto(`${onde}.vendedor`, o.vendedor, { opcional: true });
      bool(`${onde}.fonte_verificada`, o.fonte_verificada);
      url(`${onde}.url_produto`, o.url_produto, { opcional: true });
      url(`${onde}.url_loja`, o.url_loja);
      bool(`${onde}.afiliado`, o.afiliado);
      if (!STATUS_OFERTA.includes(o.status)) erro(`${onde}.status`, `um de ${STATUS_OFERTA.join(', ')}`);
      iso(`${onde}.checado_em`, o.checado_em);
      texto(`${onde}.checado_via`, o.checado_via);

      if (o.preco !== null) {
        if (!o.preco || typeof o.preco !== 'object') erro(`${onde}.preco`, 'objeto ou null');
        else {
          valor(`${onde}.preco.valor`, o.preco.valor);
          texto(`${onde}.preco.condicao`, o.preco.condicao, { opcional: true });
        }
      }
      if (o.parcelamento !== null && o.parcelamento !== undefined) {
        const p = o.parcelamento;
        if (!Number.isInteger(p.quantidade) || p.quantidade < 2) erro(`${onde}.parcelamento.quantidade`, 'inteiro maior que 1');
        valor(`${onde}.parcelamento.valor`, p.valor);
        bool(`${onde}.parcelamento.juros`, p.juros);
      }
      if (o.referencia !== null && o.referencia !== undefined) {
        texto(`${onde}.referencia.rotulo`, o.referencia.rotulo);
        valor(`${onde}.referencia.valor`, o.referencia.valor);
      }
      texto(`${onde}.variacao`, o.variacao, { opcional: true });

      if (o.veredito !== null && o.veredito !== undefined) {
        const v = o.veredito;
        if (!VEREDITOS.includes(v.tipo)) erro(`${onde}.veredito.tipo`, `um de ${VEREDITOS.join(', ')}`);
        texto(`${onde}.veredito.motivo`, v.motivo);
        // Sem base citada, não há veredito.
        texto(`${onde}.veredito.base`, v.base);
      }

      // Regras de evidência. Opcionais para relatórios antigos, obrigatórias quando o campo existe.
      if (v2 && o.evidencia === undefined) erro(`${onde}.evidencia`, 'obrigatório a partir do processo 2');
      if (o.evidencia !== undefined) {
        if (!EVIDENCIAS.includes(o.evidencia)) erro(`${onde}.evidencia`, `um de ${EVIDENCIAS.join(', ')}`);
        if (o.fonte_verificada === true && !o.vendedor) erro(`${onde}.fonte_verificada`, 'fonte verificada exige o vendedor identificado');
        if (o.veredito?.tipo === 'comprar') {
          if (!EVIDENCIAS_COMPRA.includes(o.evidencia)) erro(`${onde}.veredito`, `"comprar" exige evidência ${EVIDENCIAS_COMPRA.join(' ou ')}, recebido ${o.evidencia}`);
          if (o.fonte_verificada !== true) erro(`${onde}.veredito`, '"comprar" exige fonte verificada');
          if (o.status !== 'ok' || !o.preco) erro(`${onde}.veredito`, '"comprar" exige oferta ativa com preço à vista');
        }
      }

      if (!Array.isArray(o.como_chegar)) erro(`${onde}.como_chegar`, 'lista obrigatória (pode ser vazia)');
      else
        o.como_chegar.forEach((q, j) => {
          texto(`${onde}.como_chegar[${j}].rotulo`, q.rotulo);
          if (typeof q.texto !== 'string' || !q.texto.trim()) erro(`${onde}.como_chegar[${j}].texto`, 'texto não vazio');
        });
    });

  if (r.coleta !== undefined && r.coleta !== null) {
    if (r.coleta.notas !== undefined && !Array.isArray(r.coleta.notas)) erro('coleta.notas', 'lista de textos');
    (r.coleta.notas || []).forEach((n, i) => texto(`coleta.notas[${i}]`, n));
    const m = r.coleta.metricas;
    if (m !== undefined && m !== null) {
      for (const campo of ['buscas', 'paginas_abertas', 'candidatos', 'publicadas', 'fonte_verificada']) {
        if (m[campo] !== undefined && (!Number.isInteger(m[campo]) || m[campo] < 0)) erro(`coleta.metricas.${campo}`, 'inteiro maior ou igual a zero');
      }
      for (const [nivel, n] of Object.entries(m.por_evidencia || {})) {
        if (!EVIDENCIAS.includes(nivel)) erro(`coleta.metricas.por_evidencia.${nivel}`, `nível desconhecido; use ${EVIDENCIAS.join(', ')}`);
        if (!Number.isInteger(n) || n < 0) erro(`coleta.metricas.por_evidencia.${nivel}`, 'inteiro maior ou igual a zero');
      }
      for (const [loja, estado] of Object.entries(m.acesso || {})) {
        if (!ACESSOS.includes(estado)) erro(`coleta.metricas.acesso.${loja}`, `um de ${ACESSOS.join(', ')}`);
      }
      if (m.inicio !== undefined) iso('coleta.metricas.inicio', m.inicio);
      if (m.fim !== undefined) iso('coleta.metricas.fim', m.fim);
      if (Number.isInteger(m.publicadas) && Array.isArray(r.ofertas) && m.publicadas !== r.ofertas.length) {
        erro('coleta.metricas.publicadas', `diz ${m.publicadas}, mas o relatório tem ${r.ofertas.length} ofertas`);
      }
    }
  }

  return erros;
}
