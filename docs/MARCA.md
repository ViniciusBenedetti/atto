# Atto: guia de marca

Fonte única da marca Atto. Vale para todo produto, documento e empresa com o nome Atto, não só para o site. Mudou a marca, muda aqui primeiro; depois cada projeto aplica (no site: `CLAUDE.md`, seção "Como mudar a marca").

## O que é a Atto

A Atto é uma marca de análise de preços para quem quer economizar. Hoje o produto é um site que publica, todos os dias, as melhores ofertas de eletrônicos encontradas por um processo automático de pesquisa. A marca pode crescer para outros produtos e para uma empresa; este guia vale para todos eles.

**Propósito.** A solução para quem quer economizar. O problema de quem sabe que dá para pagar menos é o tempo e a paciência de saber onde procurar. A promessa: não é preciso continuar procurando, a busca já foi feita. As melhores ofertas das fontes mais confiáveis estão aqui.

**Posicionamento.** O mercado repete que cada promoção é "a melhor de todas", e basta consultar as fontes para ver que existe uma melhor. A Atto faz o oposto: mostra o preço verdadeiro e analisa por que comprar, e se vale comprar agora ou esperar, com base no mercado e em tendências. Fontes não confiáveis às vezes têm preço menor; a Atto reconhece e informa, e a decisão (e o que aceitar sacrificar) é do cliente.

**Valores.**

- **Clareza:** qualquer pessoa entende rápido o que está vendo.
- **Honestidade:** nunca engana; não diz que a informação é definitiva; assume que erros podem acontecer.
- **Informação:** a pessoa sabe o que está comprando, se está barato ou caro, por quê, e se vale comprar agora ou esperar.

**Princípio central: o dado é a marca.** A credibilidade da Atto depende de cada número publicado ser exatamente o que foi verificado, com a data e a fonte. Um número errado custa mais que um número ausente. Cada produto define as regras práticas desse princípio (no site: "Regra de ouro" em `CLAUDE.md`).

**Personalidade.** Técnica, confiável, sóbria, organizada, com bastante respiro. Não é amiga, não é coach, não usa conversa motivacional. Tem credibilidade por falar sério, sem esconder nada, com base em fatos. A marca é extensão do Vinícius e existe sem ele; ele assina as análises com nome.

**Público.** Pessoas comuns sem tempo para garimpar a melhor oferta, e familiares com quem o Vinícius compartilha o resultado. Assuma uso principalmente pelo celular, vindo de links compartilhados.

## Tom de voz e conteúdo

- Informativo e neutro. Nem frio, nem amigável. Fala como um analista que mostra os dados e a conclusão.
- Sem gíria, sem diminutivo, sem exclamação, sem emoji.
- Proibido: "corra", "imperdível", "últimas unidades", "você merece", contagem regressiva falsa, urgência artificial.
- Superlativo só com base: "menor preço encontrado entre 6 fontes, em 29/10/2026 14:32". "A melhor oferta" sem fonte e data é proibido.
- Todo veredito traz o motivo em uma ou duas frases e a base dele (fonte ou fato de mercado, com data). Previsão é tendência ("tende a", "pode"), nunca certeza.
- Exemplo apenas do tom: "Com o lançamento do jogo antes da Black Friday, esperar para comprar o console pode elevar o preço e o desconto aparente." O conteúdo real vem da análise; não invente tendências.
- Fonte não verificada com preço menor é exibida com o aviso "Fonte não verificada: o risco da compra é do comprador". Nunca esconda; sinalize.
- Formatos: moeda `R$ 1.234,56`; data `29/10/2026`; hora `14:32`; português do Brasil.
- Títulos descrevem o fato ("Notebooks: 12 ofertas verificadas"), não prometem.
- Assinatura em texto ao final das análises: "Análise: Vinícius Benedetti". Sem foto por enquanto.
- Se a análise tiver apoio de IA, diga isso junto da análise. Cada produto explica quem o mantém, como os dados são obtidos, quais fontes são consideradas verificadas e quando há IA.

## Identidade visual

Direção: claro, limpo, técnico, com respiro. Sem gradientes, sem sombras, sem ilustrações decorativas, sem fotos de banco de imagens. Imagem de produto vem da fonte, sem edição. Não há logotipo: o nome "Atto" é composto em `display`, cor `ink`, sem símbolo.

### Fontes

Instrument Sans (títulos e texto) e IBM Plex Mono (todo valor numérico: preços, datas, histórico). Na web, carregue do Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Estilo | Fonte | Tamanho / linha | Peso | Uso |
|---|---|---|---|---|
| display | Instrument Sans | 48 / 52 | 600 (tracking -0.02em) | Nome da marca e título principal. Uma vez por página |
| h1 | Instrument Sans | 32 / 38 | 600 (tracking -0.01em) | Título de página ou categoria |
| h2 | Instrument Sans | 24 / 30 | 600 | Título de seção |
| h3 | Instrument Sans | 18 / 26 | 600 | Nome do produto, subtítulo |
| body | Instrument Sans | 16 / 26 | 400 | Texto corrido, largura máxima 68 caracteres |
| body-sm | Instrument Sans | 14 / 22 | 400 | Apoio em cartões e tabelas |
| label | Instrument Sans | 13 / 18 | 600 | Selos, filtros, botões |
| caption | Instrument Sans | 12 / 18 | 400 | Legendas e avisos legais |
| price-xl | IBM Plex Mono | 40 / 44 | 500 | Preço em destaque |
| price | IBM Plex Mono | 24 / 28 | 500 | Preço em cartão |
| data | IBM Plex Mono | 14 / 20 | 400 | Histórico e comparativos |
| stamp | IBM Plex Mono | 12 / 16 | 400 | Data e hora de checagem |

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

- Respiro é identidade. Entre seções use `--space-8` ou `--space-9`; padding de cartão `--space-5`. Nunca comprima para caber mais conteúdo.
- Conteúdo com largura máxima de 1120px, centralizado. Mobile primeiro: uma coluna até 640px.
- Separe com bordas (`--line`, `--line-strong`), não com sombras.
- Todo valor numérico em fonte mono, para o olho comparar colunas.
- `--brand` é cor de ação; nunca use como cor de veredito.
- Veredito usa só `--buy`, `--wait` e `--risk`, sempre com palavra e ícone: "Comprar agora", "Esperar", "Atenção". Cor nunca fala sozinha. `--buy` é azul de propósito, para não depender de verde versus vermelho.
- Foco de teclado: anel sólido de 2px em `--focus`, afastado 2px, em todo controle.
- Alvos de toque com pelo menos 44px de altura.
- Contraste mínimo de 4.5:1 para texto (3:1 para bordas e ícones que carregam significado) nos dois temas.
- Ícones: traço de 1.5px em `currentColor`, SVG inline. Nunca emoji.

## Riscos da marca

- **Nome e domínio:** verificar disponibilidade de domínio e registro da marca Atto no INPI antes de investir mais na marca.
- **Cópias do guia:** o design system "Atto" no claude.ai é uma cópia visual. Este arquivo é a fonte; mantenha os dois iguais ou descontinue a cópia.
