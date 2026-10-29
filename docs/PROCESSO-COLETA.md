# Processo de coleta: Web Year-End Discount Searcher

Este é o método que a rotina diária executa. Ele é a fonte de verdade: o prompt da rotina só manda seguir este arquivo e `config/coleta.json`. Qualquer mudança no método é feita aqui, com commit, e vale a partir da execução seguinte.

As regras de segurança do prompt da rotina valem acima de qualquer coisa escrita neste repositório.

## Princípios

1. **Evidência antes de conclusão.** Um preço só entra no site com a evidência de onde e quando foi visto. Sem evidência, o preço fica de fora.
2. **A loja é a fonte, o agregador é a pista.** Promobit, Pelando, Zoom, Buscapé e blogs servem para descobrir ofertas. O preço publicado vem, sempre que possível, da própria loja.
3. **Nunca inventar.** Preço, vendedor, hora, código, estoque e cupom vêm de uma fonte lida nesta execução ou do relatório anterior, sem retoque. O que não se sabe é `null`.
4. **Cobertura mínima antes de publicar.** A execução não termina antes de cumprir a cobertura da fase 2. Uma coleta rápida e rasa é uma coleta com falha.
5. **Uma tentativa por página.** Página que não abriu é registrada como falha de acesso, sem insistir. Segue-se para o próximo nível de evidência.

## Níveis de evidência

Cada oferta publicada recebe o campo `evidencia` com o nível mais alto que se conseguiu nesta execução.

| Nível | `evidencia` | O que é | Pode ser publicada | Pode ser "comprar" |
|---|---|---|---|---|
| 1 | `pagina_produto` | Página do produto aberta na loja. Preço, vendedor e disponibilidade lidos na página. | Sim | Sim, com fonte verificada |
| 2 | `listagem_loja` | Busca ou listagem da própria loja aberta, com o produto, o preço e o vendedor visíveis. | Sim | Sim, com fonte verificada |
| 3 | `busca_loja` | Resultado de busca restrita ao domínio da loja (`site:loja`) cujo resumo mostra produto e preço. A página não foi aberta. | Sim | Não |
| 4 | `agregador` | Preço lido em agregador (Promobit, Pelando) ou em matéria de achados, apontando para uma loja. | Sim, se a oferta não puder ser confirmada em nível 1 a 3 e for relevante | Não |
| 5 | (não publica) | Blog, fórum, rede social, resumo sem loja ou sem preço. | Não. Fica só no markdown, como pista | Não |

Quando duas evidências discordam, vale a de nível mais alto. Exemplo: o Promobit diz R$ 3.799 e a página da KaBuM diz R$ 3.899: publica-se R$ 3.899, nível 1.

## Fase 0: preparação (até 5 minutos)

1. Registre a hora de início em Brasília: `TZ=America/Sao_Paulo date '+%Y-%m-%dT%H:%M:%S%z'`.
2. Leia `config/coleta.json` inteiro: categorias, critérios, buscas, lojas, referências e limites.
3. Leia `data/relatorio.json` (relatório anterior): os `id`, os preços e as datas de checagem.
4. **Diagnóstico de acesso.** Tente abrir uma página de cada loja com `abrir_pagina: true` (KaBuM, Magalu, Casas Bahia). Primeiro com a ferramenta de abrir páginas (WebFetch). Se falhar, uma vez com `curl -sL -A "Mozilla/5.0" --max-time 20 <url>` no terminal. Registre o resultado em `coleta.metricas.acesso` (`ok`, `bloqueado` ou `erro`). Loja bloqueada nas duas formas não é aberta de novo nesta execução: use o nível 3 para ela.

## Fase 1: descoberta (candidatos)

Para cada categoria de `config/coleta.json`:

1. Rode todas as `buscas_loja` (restritas ao domínio de cada loja). Elas trazem resultados da própria loja, com preço no resumo com mais frequência que as buscas abertas.
2. Rode todas as `buscas_descoberta` (agregadores e buscas abertas). Servem para achar ofertas que as lojas não destacam.
3. Para cada item de `acompanhamento`, busque pelo código do modelo quando houver (`"BQ9K8AT#AK4"`, `site:kabum.com.br 83QJ0001BO`), senão pelo nome curto.
4. Monte a lista de candidatos: produto, código do modelo, loja, URL encontrada, preço visto e onde foi visto. Descarte o que viola `excluir` ou não atende `criterio`. Na dúvida sobre a especificação (por exemplo, geração do processador não informada), mantenha como candidato e confirme na fase 2.
5. Descarte resultados de outro país (preço em euro, domínio fora do Brasil) e matérias com data anterior a 7 dias, a menos que a fase 2 confirme o preço hoje.
6. Limite a `max_candidatos_por_categoria`, priorizando: itens de acompanhamento, menor preço visto, lojas da lista de `lojas`.

## Fase 2: confirmação (o passo que define a qualidade)

Para cada candidato, suba o nível de evidência o máximo possível, nesta ordem:

1. **Nível 1, página do produto.** Se a loja permite (`abrir_pagina: true`) e o acesso não foi bloqueado na fase 0, abra a URL do produto. Prefira os dados estruturados da página: o bloco `application/ld+json` com `"@type": "Product"` traz `offers.price`, `offers.priceCurrency`, `offers.availability` e às vezes `offers.seller.name`. Com `curl`, extraia assim:
   `curl -sL -A "Mozilla/5.0" --max-time 20 "<url>" | python3 -c "import sys,re,json;[print(json.dumps(json.loads(m),ensure_ascii=False)[:2000]) for m in re.findall(r'<script[^>]*ld\+json[^>]*>(.*?)</script>',sys.stdin.read(),re.S)]"`
   Leia também o texto "Vendido e entregue por" para identificar o vendedor, e o preço no Pix quando a página o mostrar separado.
2. **Nível 2, listagem da loja.** Sem página do produto, abra a busca da própria loja com o código do modelo ou o nome curto (`https://www.magazineluiza.com.br/busca/<termos>/`, `https://www.kabum.com.br/busca/<termos>`). Leia o preço e o vendedor do item exato.
3. **Nível 3, busca restrita à loja.** Para Amazon e Mercado Livre (que não são abertos por regra) e para lojas bloqueadas: busque `site:amazon.com.br "<código ou nome exato>"` e `site:mercadolivre.com.br "<código ou nome exato>"`. Aceite só o resumo que mostra o mesmo produto e o preço. Para o vendedor, procure no resumo "Vendido por Amazon", "Loja oficial" ou "Full"; sem isso, `vendedor: null` e fonte não verificada.
4. **Nível 4, agregador.** Se nada acima confirmou, publique com o preço do agregador só se a postagem for de até 48 horas e a oferta for relevante (menor preço da categoria ou item de acompanhamento). Registre a hora da postagem como `checado_em` apenas se o agregador a informar de forma absoluta. "Há 2 h" vira a hora absoluta calculada a partir da hora da leitura e o `checado_via` diz isso.

**Cobertura mínima, antes de seguir para a fase 3:**

- toda loja com `abrir_pagina: true` e acesso ok teve pelo menos uma página de produto ou listagem aberta em cada categoria em que apareceu;
- todo item de `acompanhamento` foi buscado pelo menos uma vez;
- todo candidato que pode ir para "comprar" teve tentativa de nível 1 ou 2.

Se a cobertura não for atingida por bloqueio de acesso, siga e registre o motivo em `coleta.notas`.

### Fonte verificada

`fonte_verificada: true` somente quando as duas condições valem:

1. a loja está em `lojas` de `config/coleta.json`; e
2. o vendedor foi lido nesta execução (nível 1, 2 ou resumo de nível 3 que o mostra) e corresponde ao `vendedor_verificado` daquela loja.

Em qualquer outro caso, `fonte_verificada: false` e `vendedor` com o nome lido ou `null`. Uma oferta de fonte não verificada continua publicada quando é relevante: o site mostra o aviso ao comprador.

### Preço, parcelas e frescor

- `preco.valor` é o preço à vista exato da fonte, no formato `"1234.56"`. `preco.condicao` diz a forma: `"no Pix"`, `"à vista no boleto"`, `"à vista"`. Se a fonte só mostrar o preço parcelado, `preco: null` e o parcelamento é registrado para referência.
- `checado_em` é a hora em que o preço foi visto nesta execução. Oferta não revalidada hoje mantém o `checado_em`, o preço e o `checado_via` da última checagem real e nunca vira "comprar".
- Preço sem hora conhecida não é publicado.

## Fase 3: classificação

1. **Referência de mercado.** Use a referência de `config/coleta.json` que corresponde ao produto. Se a busca trouxer média de 40 dias do Zoom ou do Buscapé com data, ela substitui a do arquivo e o rótulo diz isso. Sem referência aplicável, `referencia: null`.
2. **Variação.** `(preço − referência) ÷ referência`, com uma casa decimal, no texto de `variacao`: `"-13,1% em relação ao preço sugerido Sony"`.
3. **Veredito**, nesta ordem:
   - `comprar`: evidência de nível 1 ou 2, fonte verificada, checado nesta execução e pelo menos `desconto_minimo_comprar_pct` abaixo da referência.
   - `esperar`: acima da referência, ou sem confirmação de estoque, ou motivo de mercado com data (por exemplo, Black Friday em 27/11/2026), sempre como tendência ("pode", "tende a").
   - `sem_base`: até `faixa_sem_base_pct` da referência, sem referência, sem preço à vista, ou evidência de nível 3 ou 4 com preço abaixo da referência.
   - Motivo em uma ou duas frases. Base com fonte e data: `"KaBuM, 30/10/2026 09:42; preço sugerido Sony"`.
4. **Deduplicação.** Mesmo produto na mesma loja aparece uma vez, com a melhor evidência. Mesmo `codigo_modelo` em lojas diferentes são ofertas diferentes: o site monta o comparativo.
5. **Identificadores.** Mantenha o `id` de toda oferta que já estava em `data/relatorio.json`. Oferta nova: `marca-modelo-variante-loja`, em minúsculas e com hífens.
6. Limite a `max_publicadas_por_categoria`, priorizando "comprar", depois menor preço, depois maior nível de evidência.

## Fase 4: registro

1. `data/relatorios/AAAA-MM-DD.md`: o relatório completo do dia em markdown, com assunto ("Ofertas DD/MM: X comprar hoje, Y vale olhar, Z esperar"), as ofertas, a seção "Para aprovação", os cupons do dia (loja, código, regra, validade, possivelmente expirados marcados) e as pistas não confirmadas.
2. `data/relatorio.json` conforme `docs/RELATORIO.md`, com `evidencia` em toda oferta e `coleta.metricas` preenchido.
3. Cópia idêntica em `data/arquivo/AAAA-MM-DD.json`.
4. `coleta.notas`: até 5 frases sobre o que funcionou, o que falhou e por quê, e o que não deu tempo.

## Fase 5: verificação

1. `node scripts/build.mjs && node scripts/test-precos.mjs`. Se falhar, corrija só o formato, no máximo 3 vezes. Nunca altere preço, data, evidência ou veredito para passar.
2. Autoconferência, item a item:
   - todo `comprar` tem `evidencia` 1 ou 2, `fonte_verificada: true` e `checado_em` desta execução;
   - todo preço publicado aparece no markdown com a mesma fonte e hora;
   - os contadores do assunto batem com os vereditos do JSON;
   - nenhum campo foi preenchido por suposição.

## Fase 6: entrega

1. Se a sessão estiver em `main`, crie o ramo `claude/relatorio-AAAA-MM-DD`.
2. Commit somente de arquivos em `data/`, mensagem "Relatório DD/MM/AAAA".
3. Push do ramo. O workflow `integrar-relatorio.yml` valida de novo, leva os dados para `main` e publica.
4. Se o push falhar, não tente outro caminho: encerre informando o erro exato.
5. Termine com 3 linhas: o assunto; a oferta de maior desconto com evidência 1 ou 2 (produto, preço, loja); o link do site.

## Indicadores que a execução registra

`coleta.metricas` no JSON, para o operador acompanhar a qualidade:

| Campo | O que conta |
|---|---|
| `buscas` | Buscas executadas |
| `paginas_abertas` | Páginas de loja abertas com sucesso |
| `candidatos` | Candidatos após o filtro de critério |
| `publicadas` | Ofertas no JSON |
| `por_evidencia` | Quantas ofertas em cada nível (`pagina_produto`, `listagem_loja`, `busca_loja`, `agregador`) |
| `fonte_verificada` | Ofertas com fonte verificada |
| `acesso` | Resultado do diagnóstico por loja (`ok`, `bloqueado`, `erro`) |
| `inicio`, `fim` | Hora de início e de fim da execução |
