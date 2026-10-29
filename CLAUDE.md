# Atto: guia de marca e de construção do site

Este arquivo é o contexto do projeto. Leia inteiro antes de escrever código e consulte sempre que houver dúvida de marca, tom ou design.

## Mapa do projeto (comece por aqui)

O site está no ar e se atualiza sozinho todo dia. Antes de mudar qualquer coisa, saiba onde cada peça vive:

| Assunto | Fonte de verdade | Observação |
|---|---|---|
| Marca, tom, visual, regras de dado | Este arquivo | Muda a marca? Comece aqui e siga "Como mudar a marca" |
| Método de coleta (o que a rotina faz) | `docs/PROCESSO-COLETA.md` | A rotina lê a cada execução |
| Categorias, critérios, lojas, buscas, referências, limites | `config/coleta.json` | A rotina lê a cada execução |
| Formato do relatório | `docs/RELATORIO.md` + `src/validar.mjs` | Contrato e validação andam juntos |
| Prompt e configuração da rotina | `docs/ROTINA.md` | Cópia exata do que está em claude.ai/code/routines |
| Publicação | `.github/workflows/` | `integrar-relatorio.yml` aceita só `data/` vindo da rotina |
| Visual do site | `src/styles.css` (tokens), `src/render.mjs`, `src/paginas.mjs` | Tokens copiados da seção "Tokens (CSS)" deste arquivo |
| Dados | `data/` | Escritos só pela rotina; correção manual segue o manual de operação |
| Operação do dia a dia, incidentes, decisões | Manual de operação no Claude Docs: https://claude.ai/artifact/A9cJT83zsHppuUYKEmNzfj | Para quem opera o processo |

- Repositório: https://github.com/ViniciusBenedetti/atto · Site: https://viniciusbenedetti.github.io/atto/
- Rotina: "Web Year-End Discount Searcher (Atto)", `trig_01SCz5QaLSUgKDMLvp5fRSJK`, diária às 09:00 de Brasília, ambiente "Atto - Coleta" (rede liberada só para as lojas), sem conectores.
- Validar antes de enviar: `npm run build` (valida, gera e roda o teste de preços; Node 20+, sem dependências).
- A skill "radar-de-ofertas" e a página Radar de Ofertas são do processo antigo. Não use para o site.

### Como mudar o escopo de produtos

1. Categoria, critério, busca, loja ou referência: edite só `config/coleta.json` (aumente `versao`, atualize `atualizado_em`). O site cria a seção da categoria nova sozinho a partir do relatório.
2. Rode a rotina uma vez manualmente e confira o relatório e `coleta.metricas`.
3. Regra de veredito ou etapa do método: `docs/PROCESSO-COLETA.md` e, se tiver número, `limites` em `config/coleta.json`.

### Como mudar a marca

A marca não chega ao site sozinha: os valores são copiados deste arquivo para o código. Ao repaginar:

1. Atualize este arquivo primeiro (tokens, tipografia, componentes, tom).
2. Copie os tokens novos para `src/styles.css` (claro, escuro e o bloco `prefers-color-scheme`) e as fontes para o `<link>` em `src/render.mjs`.
3. Componentes ou textos fixos: `src/render.mjs` e `src/paginas.mjs`. Termos proibidos de tom: `src/validar.mjs` e `scripts/test-precos.mjs`.
4. `npm run build`, confira no celular nos dois temas, publique.
5. O texto que a rotina escreve (motivos, resumo) segue o tom novo na próxima execução, porque ela lê as seções "Regra de ouro" e "Tom de voz e conteúdo" deste arquivo a cada dia.
6. Se o design system "Atto" no claude.ai também existir, atualize-o junto ou declare qual dos dois vale.

## Como trabalhar comigo

- O dono do projeto é o Vinícius. Ele valida; você executa. Faça o trabalho em sprints curtas e entregáveis, sem planejar tudo antes.
- As decisões técnicas estão delegadas a você (desde 29/10/2026): decida, registre o motivo e informe. Pergunte só o que exige ação ou escolha do Vinícius (contas, credenciais, publicar algo novo, mudança de marca, regra de negócio, custo).
- Discorde e aponte riscos quando houver fundamento. Seja direto, sem rodeios e sem elogios.
- Ao ajustar algo que você entregou, devolva o arquivo completo com a alteração aplicada, não só o trecho.
- Responda em português do Brasil.

## O que é a Atto

Um site que publica o resultado de um bot que monitora as melhores ofertas do mercado (hoje: notebooks, tablets e PS5; o escopo é editável no relatório, com itens adicionados e removidos). O bot gera um relatório com preços; o site apresenta esse relatório para qualquer pessoa navegar.

**Propósito.** A solução para quem quer economizar. O problema de quem sabe que dá para pagar menos é o tempo e a paciência de saber onde procurar. A promessa: não é preciso continuar procurando, a busca já foi feita. As melhores ofertas das fontes mais confiáveis estão aqui.

**Posicionamento.** O mercado repete que cada promoção é "a melhor de todas", e basta consultar as fontes para ver que existe uma melhor. A Atto faz o oposto: mostra o preço verdadeiro e analisa por que comprar, e se vale comprar agora ou esperar, com base no mercado e em tendências. Fontes não confiáveis às vezes têm preço menor; a Atto reconhece e informa, e a decisão (e o que aceitar sacrificar) é do cliente.

**Valores.**

- **Clareza:** qualquer pessoa entende rápido o que está vendo.
- **Honestidade:** nunca engana; não diz que a informação é definitiva; assume que erros podem acontecer.
- **Informação:** a pessoa sabe o que está comprando, se está barato ou caro, por quê, e se vale comprar agora ou esperar.

**Personalidade.** Técnica, confiável, sóbria, organizada, com bastante respiro. Não é amiga, não é coach, não usa conversa motivacional. Tem credibilidade por falar sério, sem esconder nada, com base em fatos. A marca é extensão do Vinícius e existe sem ele; ele assina as análises com nome.

**Público.** Pessoas comuns sem tempo para garimpar a melhor oferta, e familiares com quem o Vinícius compartilha o resultado. Assuma uso principalmente pelo celular, vindo de links compartilhados.

## Regra de ouro: o dado é a marca

Se o site mostrar um valor diferente do relatório, a credibilidade acaba. Portanto:

1. O preço exibido é idêntico ao valor do relatório. Nunca arredonde, nunca escreva "a partir de", nunca recalcule no front-end. Formate apenas (`R$ 1.234,56`).
2. Todo preço tem ao lado a data e a hora da checagem: "Checado em 29/10/2026 14:32" (horário de Brasília). Sem carimbo, sem preço. Não use termos relativos ("há pouco", "hoje").
3. Dado com mais de 24 horas mostra aviso de dado desatualizado com a data da última checagem. Falha de coleta mostra aviso de falha e não exibe preço. Nunca mostre preço antigo como se fosse atual.
4. Oferta encerrada ou sem estoque sai da lista ou aparece como "Encerrada", sem botão de compra.
5. Parcelas só aparecem junto do preço à vista, ambos exatos.
6. Toda página de produto tem a ação "Reportar preço divergente". O erro é assumido e corrigido.
7. A marca nunca mente para ganhar público: se a melhor oferta é cara, mostra assim mesmo.
8. Construa um teste automatizado que compare o preço renderizado com o valor do relatório para todas as ofertas. Falhou, não publica.

## Tom de voz e conteúdo

- Informativo e neutro. Nem frio, nem amigável. Fala como um analista que mostra os dados e a conclusão.
- Sem gíria, sem diminutivo, sem exclamação, sem emoji.
- Proibido: "corra", "imperdível", "últimas unidades", "você merece", contagem regressiva falsa, urgência artificial.
- Superlativo só com base: "menor preço encontrado entre 6 fontes, em 29/10/2026 14:32". "A melhor oferta" sem fonte e data é proibido.
- Todo veredito traz o motivo em uma ou duas frases e a base dele (fonte ou fato de mercado, com data). Previsão é tendência ("tende a", "pode"), nunca certeza.
- Exemplo apenas do tom: "Com o lançamento do jogo antes da Black Friday, esperar para comprar o console pode elevar o preço e o desconto aparente." O conteúdo real vem da análise do relatório; não invente tendências.
- Fonte não verificada com preço menor é exibida com o aviso "Fonte não verificada: o risco da compra é do comprador". Nunca esconda; sinalize.
- Formatos: moeda `R$ 1.234,56`; data `29/10/2026`; hora `14:32`; português do Brasil.
- Títulos descrevem o fato ("Notebooks: 12 ofertas verificadas"), não prometem.
- Assinatura em texto ao final das análises: "Análise: Vinícius Benedetti". Sem foto por enquanto.
- Se a análise tiver apoio de IA, diga isso na página (em `caption`). A página "Sobre" explica quem mantém o site, como a coleta funciona, quais fontes são consideradas verificadas e quando há IA na análise.

## Identidade visual

Direção: claro, limpo, técnico, com respiro. Sem gradientes, sem sombras, sem ilustrações decorativas, sem fotos de banco de imagens. A imagem do produto vem da fonte da oferta, sem edição. Não há logotipo: o nome "Atto" é composto em `display`, cor `ink`, sem símbolo.

### Fontes

Instrument Sans (títulos e texto) e IBM Plex Mono (todo valor numérico: preços, datas, histórico). Carregue do Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Estilo | Fonte | Tamanho / linha | Peso | Uso |
|---|---|---|---|---|
| display | Instrument Sans | 48 / 52 | 600 (tracking -0.02em) | Nome da marca e título da home. Uma vez por página |
| h1 | Instrument Sans | 32 / 38 | 600 (tracking -0.01em) | Título de categoria |
| h2 | Instrument Sans | 24 / 30 | 600 | Título de seção |
| h3 | Instrument Sans | 18 / 26 | 600 | Nome do produto |
| body | Instrument Sans | 16 / 26 | 400 | Texto corrido, largura máxima 68 caracteres |
| body-sm | Instrument Sans | 14 / 22 | 400 | Apoio em cartões e tabelas |
| label | Instrument Sans | 13 / 18 | 600 | Selos, filtros, botões |
| caption | Instrument Sans | 12 / 18 | 400 | Legendas e avisos legais |
| price-xl | IBM Plex Mono | 40 / 44 | 500 | Preço na página do produto |
| price | IBM Plex Mono | 24 / 28 | 500 | Preço no cartão |
| data | IBM Plex Mono | 14 / 20 | 400 | Histórico e comparativos |
| stamp | IBM Plex Mono | 12 / 16 | 400 | Data e hora da checagem |

### Tokens (CSS)

Use estas variáveis como única fonte de valores. Não escreva cores ou medidas soltas nos componentes.

```css
:root, [data-theme="light"] {
  --surface: #f6f6f1;         /* fundo da página */
  --surface-raised: #ffffff;  /* cartões, painéis, campos */
  --surface-sunken: #ebebe4;  /* faixas de apoio, filtros */
  --ink: #121715;             /* texto principal */
  --ink-muted: #4b534f;       /* texto secundário (não usar sobre brand-tint) */
  --line: #d8d8cf;            /* divisórias decorativas */
  --line-strong: #7f8783;     /* bordas que precisam ser percebidas */
  --brand: #1b4d3e;           /* ação: botão principal, links */
  --on-brand: #ffffff;        /* texto sobre brand */
  --brand-tint: #dcebe4;      /* fundo suave de selos (texto: ink) */
  --buy: #00578a;             /* veredito "comprar agora" */
  --buy-bg: #dfecf6;
  --wait: #7a4d00;            /* veredito "esperar" e dado desatualizado */
  --wait-bg: #faecd0;
  --risk: #9c3b00;            /* fonte não verificada, divergência, falha */
  --risk-bg: #fae3d6;
  --focus: #1b4d3e;           /* anel de foco */

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 64px; --space-9: 96px;

  --radius-sm: 4px;   /* selos, campos, botões */
  --radius-md: 8px;   /* cartões */
  --radius-lg: 12px;  /* seções destacadas */

  --font-sans: "Instrument Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}

[data-theme="dark"] {
  --surface: #0f1412;
  --surface-raised: #171e1b;
  --surface-sunken: #0a0e0d;
  --ink: #ecefea;
  --ink-muted: #a6aea9;
  --line: #2a332f;
  --line-strong: #6f7873;
  --brand: #86c9ac;
  --on-brand: #0b1f17;
  --brand-tint: #2d5646;
  --buy: #7fc0ee;
  --buy-bg: #12283a;
  --wait: #e8b95c;
  --wait-bg: #2f2410;
  --risk: #f0996a;
  --risk-bg: #33190c;
  --focus: #86c9ac;
}
```

Respeite `prefers-color-scheme` para escolher o tema inicial e permita alternar.

### Regras visuais

- Respiro é identidade. Entre seções use `--space-8` ou `--space-9`; padding de cartão `--space-5`. Nunca comprima para caber mais ofertas.
- Conteúdo com largura máxima de 1120px, centralizado. Mobile primeiro: uma coluna até 640px.
- Separe com bordas (`--line`, `--line-strong`), não com sombras.
- Todo valor numérico em fonte mono, para o olho comparar colunas.
- `--brand` é cor de ação; nunca use como cor de veredito.
- Veredito usa só `--buy`, `--wait` e `--risk`, sempre com palavra e ícone: "Comprar agora", "Esperar", "Atenção". Cor nunca fala sozinha. `--buy` é azul de propósito, para não depender de verde versus vermelho.
- Foco de teclado: anel sólido de 2px em `--focus`, afastado 2px, em todo controle.
- Alvos de toque com pelo menos 44px de altura.
- Contraste mínimo de 4.5:1 para texto (3:1 para bordas e ícones que carregam significado) nos dois temas.
- Ícones: traço de 1.5px em `currentColor`, SVG inline. Nunca emoji.

## Componentes

Todos recebem dados direto do relatório, sem transformar valores.

**OfferCard.** Ordem fixa: imagem da fonte, nome (h3) e loja, preço (`price`), menor preço em 90 dias (`data`), SourceTag, PriceStamp, Verdict, botão "Ver na loja", link "Reportar preço divergente". Fundo `--surface-raised`, borda 1px `--line-strong`, raio `--radius-md`, padding `--space-5`, largura de cerca de 320px em grade. Oferta encerrada: sem botão, texto "Encerrada". Não use para anúncio, destaque patrocinado ou contagem regressiva.

**Verdict.** Estados: "Comprar agora" (`--buy` sobre `--buy-bg`), "Esperar" (`--wait` sobre `--wait-bg`), "Sem base suficiente" (`--ink-muted` sobre `--surface-raised`, borda `--line-strong`). Cada um com ícone, motivo em uma ou duas frases (`body-sm`) e a base ("Base: fonte, data") em `stamp`. Sem base citada, não há veredito.

**PriceStamp.** Atual: ícone de relógio e texto `stamp` ("Checado em 29/10/2026 14:32"). Mais de 24 horas: aviso `--wait` sobre `--wait-bg` com a data da última checagem. Falha na coleta: aviso `--risk` sobre `--risk-bg`, sem preço.

**SourceTag.** "Fonte verificada": fundo `--brand-tint`, texto `--ink`, ícone de confirmação. "Fonte não verificada": fundo `--risk-bg`, texto e borda `--risk`, ícone de alerta; acompanha o aviso "O risco da compra é do comprador" na página do produto.

**Botão.** Principal: fundo `--brand`, texto `--on-brand`, altura mínima 44px, `--radius-sm`, rótulo em `label`. Secundário: borda `--line-strong`, texto `--ink`.

## Páginas (proposta, a validar com o Vinícius)

1. **Home:** nome Atto, uma frase de propósito, ofertas por categoria com filtro e ordenação, data da última atualização do relatório em destaque.
2. **Categoria:** lista de OfferCards, filtros (preço, loja, fonte verificada), ordenação, busca.
3. **Produto:** preço em `price-xl`, carimbo, histórico de preço, análise com veredito e base, comparativo entre fontes, "Reportar preço divergente".
4. **Sobre e metodologia:** quem mantém, como a coleta funciona, critério de fonte verificada, uso de IA, assinatura.
5. **Privacidade, termos e aviso de afiliados:** obrigatórios. Se houver link de afiliado, avise de forma clara em todas as páginas com ofertas.

## Qualidade de um bom site (checklist de entrega)

- Em 5 segundos a pessoa entende o que é, para quem é e qual a melhor oferta agora.
- Rápido no celular: imagens otimizadas, sem pop-up, sem bibliotecas desnecessárias.
- Acessível: HTML semântico, contraste, foco visível, navegação por teclado, texto alternativo, `lang="pt-BR"`.
- Estados tratados: carregando, vazio, erro, oferta encerrada, dado desatualizado.
- SEO básico e pré-visualização de link (Open Graph) boa para compartilhamento em mensageiros.
- Canal de contato claro e FAQ curto.
- LGPD: política de privacidade e consentimento de cookies, e e-mail só se houver coleta (ex.: alerta de preço).
- Métricas básicas de uso, sem rastreamento invasivo.

## Riscos a tratar antes do lançamento

- **Preço desatualizado** destrói a confiança. O site precisa mostrar claramente a idade do dado e o estado de falha.
- **Termos das lojas:** confirmar se o uso de preços e imagens das fontes é permitido. Não é parecer jurídico; o Vinícius deve verificar.
- **Link de afiliado sem aviso** pode gerar problema com consumidores e publicidade. Avisar desde o começo.
- **Análise com tom de autoridade:** só publique veredito com base citada e linguagem de tendência.
- **Nome e domínio:** verificar disponibilidade de domínio e registro da marca Atto (INPI) antes de investir na marca.

## Decisões tomadas (29/10/2026)

1. Stack e hospedagem: site estático gerado por Node sem dependências, publicado no GitHub Pages pelo GitHub Actions; repositório público.
2. Relatório: JSON em `data/relatorio.json` (contrato em `docs/RELATORIO.md`), gravado pela rotina num ramo `claude/` e integrado por workflow.
3. Frequência: diária às 09:00 de Brasília. O navegador de quem visita marca dado com mais de 24 horas como desatualizado.
4. Monetização: links de afiliado previstos, aviso publicado; ainda sem programa ativo.
5. Coleta: processo 2, com níveis de evidência; "comprar" exige preço confirmado na loja e fonte verificada (o build recusa o contrário).

O registro completo de decisões e as pendências estão no manual de operação (seção 12).

## Decisões em aberto: pergunte ao Vinícius antes de assumir

1. Domínio próprio e canais de distribuição (WhatsApp, Instagram, link direto).
2. Se a assinatura "Análise: Vinícius Benedetti" é a definitiva, e se haverá foto no futuro.
3. Alerta de preço, newsletter ou outra notificação para visitantes: quando e por qual canal.
4. Indexação pelos buscadores (hoje permitida) e e-mail público de contato.

## Primeiras sprints sugeridas

1. **Fundação:** projeto, tokens CSS, fontes, tema claro e escuro, layout base responsivo.
2. **Dados:** leitura do relatório, modelo de dados, formatação exata de preço e data, teste que compara preço renderizado com o relatório.
3. **Cartão e lista:** OfferCard, SourceTag, PriceStamp, Verdict, página de categoria com filtros.
4. **Produto e confiança:** página de produto, histórico, "Reportar preço divergente", Sobre e metodologia, avisos legais.
5. **Qualidade e lançamento:** acessibilidade, desempenho, SEO, testes, domínio e publicação.

Ao fim de cada sprint, mostre o resultado ao Vinícius e peça validação antes de seguir.
