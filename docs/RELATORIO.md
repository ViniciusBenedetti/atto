# Contrato do relatório (`data/relatorio.json`)

A rotina grava este arquivo a cada execução. O site só formata o que está aqui: nada é arredondado nem recalculado. Se o arquivo violar este contrato, o build falha e o site continua com a versão anterior.

## Regras gerais

- Valores em reais são **texto** com ponto e duas casas: `"3347.07"`, `"2598.00"`. Nunca número, nunca vírgula, nunca sem centavos. Se a fonte mostrar `R$ 2.032`, grave `"2032.00"`.
- Datas e horas em ISO 8601 com fuso: `"2026-10-29T10:25:00-03:00"`. A hora é a do momento em que o preço foi visto, não a da execução.
- Dado que a fonte não informou é `null`. Nunca invente.
- Textos sem exclamação, emoji, "a partir de", "corra", "imperdível", "últimas unidades", "você merece". O build recusa.
- `id` de oferta é estável entre dias (é a URL da página e a chave do histórico): `marca-modelo-variante-loja`, minúsculas e hífens. Ex.: `hp-256r-g9-i3-1315u-kabum`.

## Estrutura

```json
{
  "schema": 1,
  "processo": 2,
  "gerado_em": "2026-10-30T09:40:00-03:00",
  "analise": { "autor": "Vinícius Benedetti", "apoio_ia": true },
  "resumo": "Uma a três frases com a conclusão do dia.",
  "categorias": [
    { "id": "notebooks", "nome": "Notebooks", "status": "ok", "criterio": "..." },
    { "id": "tablets", "nome": "Tablets", "status": "falha", "criterio": "...", "motivo": "Por que a coleta falhou." }
  ],
  "ofertas": [ { "...": "ver abaixo" } ],
  "coleta": {
    "fontes_consultadas": ["Promobit", "Magalu", "KaBuM"],
    "notas": ["O que funcionou.", "O que falhou e por quê.", "O que não deu tempo."],
    "metricas": {
      "inicio": "2026-10-30T09:02:00-03:00",
      "fim": "2026-10-30T09:38:00-03:00",
      "buscas": 46,
      "paginas_abertas": 14,
      "candidatos": 21,
      "publicadas": 12,
      "por_evidencia": { "pagina_produto": 7, "listagem_loja": 2, "busca_loja": 2, "agregador": 1 },
      "fonte_verificada": 9,
      "acesso": { "kabum.com.br": "ok", "magazineluiza.com.br": "ok", "casasbahia.com.br": "bloqueado" }
    }
  }
}
```

`coleta.metricas` é obrigatório a partir da versão 2 do processo. `publicadas` precisa ser igual ao número de ofertas; o build confere.

Não inclua `"exemplo": true`: essa marca existe só nos dados de teste.

### Oferta

| Campo | Tipo | Regra |
|---|---|---|
| `id` | texto | Estável entre dias, único. |
| `categoria` | texto | Um `id` de `categorias`. |
| `nome` | texto | Nome com modelo e especificação principal. |
| `especificacoes` | texto ou null | CPU, RAM, armazenamento, sistema, tela. |
| `codigo_modelo` | texto ou null | Código do fabricante. Ofertas com o mesmo código entram no comparativo entre fontes. |
| `imagem` | URL https ou null | Imagem da fonte da oferta, sem edição. |
| `loja` | texto | Nome da loja. |
| `vendedor` | texto ou null | Quem vende de fato. |
| `fonte_verificada` | true/false | true só quando a loja está em `lojas` de `config/coleta.json` e o vendedor lido nesta execução corresponde ao `vendedor_verificado` dela. Vendedor desconhecido ou terceiro: false. Com `evidencia` presente, true exige `vendedor` preenchido. |
| `evidencia` | texto | Nível de evidência do preço (docs/PROCESSO-COLETA.md): `pagina_produto`, `listagem_loja`, `busca_loja` ou `agregador`. Obrigatório a partir da versão 2 do processo. "comprar" exige `pagina_produto` ou `listagem_loja` e fonte verificada; o build recusa o contrário. |
| `url_produto` | URL https ou null | Página do produto na loja. Nunca encurtador ou afiliado de terceiros. |
| `url_loja` | URL https | Página inicial da loja. |
| `afiliado` | true/false | true se `url_produto` for link de afiliado da Atto. |
| `status` | `ok`, `falha`, `encerrada` | `falha`: não exibe preço. `encerrada`: aparece como Encerrada, sem botão. |
| `preco` | objeto ou null | `{ "valor": "3347.07", "condicao": "no Pix" }`. Preço à vista. `condicao` null se a fonte não disse a forma. Sem preço à vista: `null`. |
| `parcelamento` | objeto ou null | `{ "quantidade": 10, "valor": "359.90", "juros": false }`. Só é exibido se houver `preco`. |
| `referencia` | objeto ou null | `{ "rotulo": "Preço sugerido Sony (digital)", "valor": "4599.90" }`. Diga qual referência é. |
| `variacao` | texto ou null | Texto pronto do relatório, ex.: `"+28,8% em relação à referência"`. O site não calcula. |
| `checado_em` | ISO 8601 | Quando o preço foi visto. |
| `checado_via` | texto | Origem: `"página do produto na KaBuM"`, `"listagem de busca do Magalu"`, `"listagem do Promobit"`, `"resumo de busca (Google)"`. |
| `veredito` | objeto ou null | `{ "tipo": "comprar" | "esperar" | "sem_base", "motivo": "1 ou 2 frases", "base": "Fonte, DD/MM/AAAA HH:MM; referência" }`. Sem base, use null. |
| `como_chegar` | lista | `[{ "rotulo": "Por código KaBuM", "texto": "873586" }]`. Textos para colar na busca da loja. |

### Da decisão da rotina para o veredito do site

| Rotina | `veredito.tipo` | Exibido como |
|---|---|---|
| COMPRAR HOJE | `comprar` | Comprar agora |
| VALE OLHAR | `sem_base` | Sem base suficiente |
| ESPERAR | `esperar` | Esperar |
| Para aprovação (fora do critério) | não entra no site | |
| Não revalidado hoje (só o último preço conhecido) | entra com o `checado_em` original | O site mostra "Dado desatualizado" |
| Pista de blog, fórum ou resumo sem loja | não entra no site | Fica só no markdown |

As regras completas de cada veredito estão em `docs/PROCESSO-COLETA.md`, fase 3.

## Arquivo histórico

Depois de gravar `data/relatorio.json`, copie o mesmo arquivo para `data/arquivo/AAAA-MM-DD.json` (data de Brasília). O histórico de preço de cada oferta é montado a partir desses arquivos.
