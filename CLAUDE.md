# Atto: site de ofertas e processo de coleta

Contexto do projeto do site da Atto. Leia inteiro antes de escrever código. O guia de marca (identidade, tom, visual) é a fonte única para tudo que tem o nome Atto e está incluído abaixo:

@docs/MARCA.md

## Mapa do projeto (comece por aqui)

O site está no ar e se atualiza sozinho todo dia. Antes de mudar qualquer coisa, saiba onde cada peça vive:

| Assunto | Fonte de verdade | Observação |
|---|---|---|
| Marca: identidade, tom de voz, visual, tokens | `docs/MARCA.md` | Vale para toda a marca, não só o site |
| Regras de dado do site, componentes, páginas | Este arquivo | |
| Método de coleta (o que a rotina faz) | `docs/PROCESSO-COLETA.md` | A rotina lê a cada execução |
| Categorias, critérios, lojas, buscas, referências, limites | `config/coleta.json` | A rotina lê a cada execução |
| Formato do relatório | `docs/RELATORIO.md` + `src/validar.mjs` | Contrato e validação andam juntos |
| Prompt e configuração da rotina | `docs/ROTINA.md` | Cópia exata do que está em claude.ai/code/routines |
| Publicação | `.github/workflows/` | `integrar-relatorio.yml` aceita só `data/` vindo da rotina |
| Visual do site | `src/styles.css` (tokens), `src/render.mjs`, `src/paginas.mjs` | Tokens copiados de `docs/MARCA.md` |
| Dados | `data/` | Escritos só pela rotina; correção manual segue o manual de operação |
| Operação do dia a dia, incidentes, decisões | Manual de operação no Claude Docs: https://claude.ai/artifact/A9cJT83zsHppuUYKEmNzfj | Para quem opera o processo |

- Repositório: https://github.com/ViniciusBenedetti/atto · Site: https://viniciusbenedetti.github.io/atto/
- Rotina: "Web Year-End Discount Searcher (Atto)", `trig_01SCz5QaLSUgKDMLvp5fRSJK`, diária às 09:00 de Brasília, ambiente "Atto - Coleta" (rede liberada só para as lojas), sem conectores.
- Validar antes de enviar: `npm run build` (valida, gera e roda o teste de preços; Node 20+, sem dependências).
- A skill "radar-de-ofertas" e a página Radar de Ofertas são do processo antigo. Não use para o site.
- Dono: Vinícius Benedetti. Decisões técnicas delegadas ao Claude desde 29/10/2026; perguntar só o que exige ação ou escolha dele (contas, credenciais, publicar algo novo, marca, regra de negócio, custo).

### Como mudar o escopo de produtos

1. Categoria, critério, busca, loja ou referência: edite só `config/coleta.json` (aumente `versao`, atualize `atualizado_em`). O site cria a seção da categoria nova sozinho a partir do relatório.
2. Rode a rotina uma vez manualmente e confira o relatório e `coleta.metricas`.
3. Regra de veredito ou etapa do método: `docs/PROCESSO-COLETA.md` e, se tiver número, `limites` em `config/coleta.json`.

### Como mudar a marca

A marca não chega ao site sozinha: os valores são copiados de `docs/MARCA.md` para o código. Ao repaginar:

1. Atualize `docs/MARCA.md` primeiro (tokens, tipografia, tom).
2. Copie os tokens novos para `src/styles.css` (claro, escuro e o bloco `prefers-color-scheme`) e as fontes para o `<link>` em `src/render.mjs`.
3. Componentes ou textos fixos: `src/render.mjs` e `src/paginas.mjs`. Termos proibidos de tom: `src/validar.mjs` e `scripts/test-precos.mjs`.
4. `npm run build`, confira no celular nos dois temas, publique.
5. O texto que a rotina escreve (motivos, resumo) segue o tom novo na próxima execução, porque ela lê `docs/MARCA.md` e a "Regra de ouro" deste arquivo a cada dia.

### Retomar de outro computador ou sem esta pasta

Tudo o que o projeto precisa está no repositório do GitHub, e a rotina e o site rodam na nuvem. Este computador não é necessário para nada funcionar.

- **Só conversar e alterar, sem instalar nada:** abra https://claude.ai/code, escolha o repositório `ViniciusBenedetti/atto` e peça o que precisar. O Claude lê este arquivo e o guia de marca sozinho.
- **Montar a pasta local de novo:** instale Git, Node 20+ e Claude Code. Crie a pasta `atto`, clone o repositório em `atto/site` e crie `atto/CLAUDE.md` com o conteúdo de "Arquivo da pasta da marca", abaixo.

#### Arquivo da pasta da marca

O arquivo `atto/CLAUDE.md`, fora do repositório, faz qualquer projeto futuro dentro da pasta `atto` seguir o guia de marca. Conteúdo:

```markdown
# Atto (marca)

Esta pasta reúne tudo da marca Atto. Todo projeto dentro dela (o site em `site/` hoje; empresa, documentos e outros produtos no futuro) segue o guia de marca abaixo, que é a fonte única e fica versionado no repositório do site.

@site/docs/MARCA.md

- Projeto novo da marca: crie uma subpasta aqui. O guia acima já vale para ela.
- Mudança de marca: edite `site/docs/MARCA.md`, faça commit e aplique em cada projeto (no site: `site/CLAUDE.md`, "Como mudar a marca").
- Se a marca ganhar repositório próprio, mova o guia para lá e troque o caminho do `@` acima.
```

## O que o site é

Um site que publica o resultado de um processo automático que monitora as melhores ofertas do mercado (hoje: notebooks, tablets e PS5; o escopo é editável em `config/coleta.json`). A rotina gera um relatório com preços; o site apresenta esse relatório para qualquer pessoa navegar.

## Regra de ouro: o dado é a marca

Se o site mostrar um valor diferente do relatório, a credibilidade acaba. Portanto:

1. O preço exibido é idêntico ao valor do relatório. Nunca arredonde, nunca escreva "a partir de", nunca recalcule no front-end. Formate apenas (`R$ 1.234,56`).
2. Todo preço tem ao lado a data e a hora da checagem: "Checado em 29/10/2026 14:32" (horário de Brasília). Sem carimbo, sem preço. Não use termos relativos ("há pouco", "hoje").
3. Dado com mais de 24 horas mostra aviso de dado desatualizado com a data da última checagem. Falha de coleta mostra aviso de falha e não exibe preço. Nunca mostre preço antigo como se fosse atual.
4. Oferta encerrada ou sem estoque sai da lista ou aparece como "Encerrada", sem botão de compra.
5. Parcelas só aparecem junto do preço à vista, ambos exatos.
6. Toda página de produto tem a ação "Reportar preço divergente". O erro é assumido e corrigido.
7. A marca nunca mente para ganhar público: se a melhor oferta é cara, mostra assim mesmo.
8. Um teste automatizado compara o preço renderizado com o valor do relatório para todas as ofertas. Falhou, não publica.

## Componentes

Todos recebem dados direto do relatório, sem transformar valores.

**OfferCard.** Ordem fixa: imagem da fonte, nome (h3) e loja, preço (`price`), referência de mercado (`data`), SourceTag, PriceStamp, Verdict, botão "Ver na loja", link "Reportar preço divergente". Fundo `--surface-raised`, borda 1px `--line-strong`, raio `--radius-md`, padding `--space-5`, largura de cerca de 320px em grade. Oferta encerrada: sem botão, texto "Encerrada". Não use para anúncio, destaque patrocinado ou contagem regressiva.

**Verdict.** Estados: "Comprar agora" (`--buy` sobre `--buy-bg`), "Esperar" (`--wait` sobre `--wait-bg`), "Sem base suficiente" (`--ink-muted` sobre `--surface-raised`, borda `--line-strong`). Cada um com ícone, motivo em uma ou duas frases (`body-sm`) e a base ("Base: fonte, data") em `stamp`. Sem base citada, não há veredito.

**PriceStamp.** Atual: ícone de relógio e texto `stamp` ("Checado em 29/10/2026 14:32"), seguido da origem e do nível de evidência do preço. Mais de 24 horas: aviso `--wait` sobre `--wait-bg` com a data da última checagem. Falha na coleta: aviso `--risk` sobre `--risk-bg`, sem preço.

**SourceTag.** "Fonte verificada": fundo `--brand-tint`, texto `--ink`, ícone de confirmação. "Fonte não verificada": fundo `--risk-bg`, texto e borda `--risk`, ícone de alerta; acompanha o aviso "O risco da compra é do comprador" na página do produto.

**Botão.** Principal: fundo `--brand`, texto `--on-brand`, altura mínima 44px, `--radius-sm`, rótulo em `label`. Secundário: borda `--line-strong`, texto `--ink`.

## Páginas

1. **Início:** nome Atto, frase de propósito, data da última atualização em destaque, "Comprar agora", todas as ofertas por categoria com busca, filtros e ordenação, notas e métricas da coleta.
2. **Categoria:** lista de OfferCards, filtros (preço, loja, fonte verificada), ordenação, busca.
3. **Oferta:** preço em `price-xl`, carimbo, veredito com base, "Como chegar na oferta", comparativo entre lojas, histórico de preço, "Reportar preço divergente".
4. **Sobre e metodologia:** quem mantém, como a coleta funciona, critério de fonte verificada, vereditos, uso de IA, perguntas frequentes, contato.
5. **Privacidade, termos e aviso de afiliados:** com links de afiliado, o aviso aparece em todas as páginas com ofertas.

## Qualidade de um bom site (checklist de entrega)

- Em 5 segundos a pessoa entende o que é, para quem é e qual a melhor oferta agora.
- Rápido no celular: imagens otimizadas, sem pop-up, sem bibliotecas desnecessárias.
- Acessível: HTML semântico, contraste, foco visível, navegação por teclado, texto alternativo, `lang="pt-BR"`.
- Estados tratados: vazio, erro, oferta encerrada, dado desatualizado.
- SEO básico e pré-visualização de link (Open Graph) boa para compartilhamento em mensageiros.
- Canal de contato claro e FAQ curto.
- LGPD: política de privacidade, sem cookies; e-mail só se houver coleta (ex.: alerta de preço), com consentimento.
- Métricas básicas de uso, sem rastreamento invasivo.

## Riscos a tratar antes da divulgação

- **Preço desatualizado** destrói a confiança. O site mostra a idade do dado, o estado de falha e o nível de evidência de cada preço.
- **Termos das lojas:** confirmar se o uso de preços e imagens das fontes é permitido. Não é parecer jurídico; o Vinícius deve verificar.
- **Link de afiliado sem aviso** pode gerar problema com consumidores e publicidade. O aviso já existe.
- **Análise com tom de autoridade:** só publique veredito com base citada e linguagem de tendência.

## Decisões tomadas (29/10/2026)

1. Stack e hospedagem: site estático gerado por Node sem dependências, publicado no GitHub Pages pelo GitHub Actions; repositório público.
2. Relatório: JSON em `data/relatorio.json` (contrato em `docs/RELATORIO.md`), gravado pela rotina num ramo `claude/` e integrado por workflow.
3. Frequência: diária às 09:00 de Brasília. O navegador de quem visita marca dado com mais de 24 horas como desatualizado.
4. Monetização: links de afiliado previstos, aviso publicado; ainda sem programa ativo.
5. Coleta: processo 2, com níveis de evidência; "comprar" exige preço confirmado na loja e fonte verificada (o build recusa o contrário).
6. Organização: guia de marca em `docs/MARCA.md` (vale para toda a marca); este arquivo só para o site.

O registro completo de decisões e as pendências estão no manual de operação (seção 12).

## Decisões em aberto: pergunte ao Vinícius antes de assumir

1. Domínio próprio e canais de distribuição (WhatsApp, Instagram, link direto).
2. Se a assinatura "Análise: Vinícius Benedetti" é a definitiva, e se haverá foto no futuro.
3. Alerta de preço, newsletter ou outra notificação para visitantes: quando e por qual canal.
4. Indexação pelos buscadores (hoje permitida) e e-mail público de contato.

## Situação das etapas

Fundação, dados, cartão e lista, produto e confiança: concluídas em 29/10/2026. Qualidade e lançamento: em andamento (pendências no manual, seção 12). Ao fim de cada etapa, mostre o resultado ao Vinícius e peça validação antes de seguir.
