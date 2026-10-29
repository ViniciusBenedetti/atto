# Atto: guia de marca e de construção do site

Este arquivo é o contexto do projeto. Leia inteiro antes de escrever código e consulte sempre que houver dúvida de marca, tom ou design.

## Como trabalhar comigo

- O dono do projeto é o Vinícius. Ele valida; você executa. Faça o trabalho em sprints curtas e entregáveis, sem planejar tudo antes.
- Não assuma. Se faltar informação (stack, hospedagem, formato do relatório, domínio, monetização), pergunte antes de decidir. Ofereça uma recomendação junto com a pergunta.
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

## Decisões em aberto: pergunte ao Vinícius antes de assumir

1. Stack e hospedagem do site (sugira opções com prós e contras antes de escolher).
2. Formato do relatório do bot (peça um exemplo real) e como ele chega ao site: arquivo, API ou banco de dados.
3. Frequência de atualização e como o site sabe que o dado está desatualizado.
4. Monetização (afiliados, anúncios, nenhuma por enquanto) e o aviso de transparência correspondente.
5. Domínio e canais de distribuição (WhatsApp, Instagram, link direto).
6. Se a assinatura "Análise: Vinícius Benedetti" é a que ele quer, e se haverá foto no futuro.
7. Alerta de preço ou newsletter: entram no primeiro lançamento?

## Primeiras sprints sugeridas

1. **Fundação:** projeto, tokens CSS, fontes, tema claro e escuro, layout base responsivo.
2. **Dados:** leitura do relatório, modelo de dados, formatação exata de preço e data, teste que compara preço renderizado com o relatório.
3. **Cartão e lista:** OfferCard, SourceTag, PriceStamp, Verdict, página de categoria com filtros.
4. **Produto e confiança:** página de produto, histórico, "Reportar preço divergente", Sobre e metodologia, avisos legais.
5. **Qualidade e lançamento:** acessibilidade, desempenho, SEO, testes, domínio e publicação.

Ao fim de cada sprint, mostre o resultado ao Vinícius e peça validação antes de seguir.
