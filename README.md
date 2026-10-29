# Atto

Site estático que publica o relatório diário de ofertas. Guia de marca (vale para toda a Atto): `docs/MARCA.md`. Regras do site e mapa do projeto: `CLAUDE.md`.

## Como funciona

```
rotina diária (09:00) -> data/relatorio.json -> push em claude/relatorio-AAAA-MM-DD
  -> GitHub Actions: aceita só data/, leva para main, npm run build, GitHub Pages
       1. valida o relatório (src/validar.mjs)
       2. gera o HTML em dist/ (scripts/build.mjs)
       3. compara cada preço renderizado com o relatório (scripts/test-precos.mjs)
     falhou em qualquer etapa: nada é publicado, a versão anterior fica no ar
```

Detalhes em `docs/PUBLICACAO.md` e `docs/ROTINA.md`.

No navegador, `src/app.js` compara a hora de cada checagem com o relógio de quem visita: passou de 24 horas, aparece o aviso de dado desatualizado, mesmo que a rotina não tenha rodado.

## Comandos

Requer Node 20 ou superior. Sem dependências: não precisa de `npm install`.

- `npm run build`: valida, gera `dist/` e roda o teste de preços.
- `npm test`: só o teste de preços, sobre o `dist/` atual.
- `npm run serve`: visualiza `dist/` em http://localhost:4321.

## Arquivos

- `site.config.json`: nome, URL, e-mail de contato, afiliados, métricas.
- `data/relatorio.json`: relatório atual. Contrato em `docs/RELATORIO.md`.
- `data/arquivo/`: um relatório por dia, base do histórico de preço.
- `src/`: estilos, script do navegador, formatação, validação e páginas.
- `data/relatorios/`: relatório do dia em markdown, gravado pela rotina.
- `.github/workflows/`: integração dos dados da rotina e publicação.
- `docs/PUBLICACAO.md`: como o site é publicado.
- `docs/ROTINA.md`: o que a rotina diária faz.

Os dados atuais são de exemplo, transcritos do Radar de Ofertas de 29/10/2026. Onde o original dizia "~10:25", foi gravado 10:25; a hora do relatório (10:30) é aproximada.
