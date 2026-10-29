# Publicação: GitHub Pages + rotina diária

## Como o site se atualiza

```
09:00 (Brasília)  rotina do Claude Code com o repositório atto
                  pesquisa -> data/relatorio.json + data/arquivo/AAAA-MM-DD.json
                  roda build e teste -> push no ramo claude/relatorio-AAAA-MM-DD
GitHub Actions    integrar-relatorio.yml: aceita só mudanças em data/, roda build e
                  teste de preços, grava em main e dispara publicar.yml
                  publicar.yml: build, teste e publicação no GitHub Pages
```

Qualquer falha de validação ou do teste de preços interrompe o processo: o site continua com a versão anterior, e o aviso de dado desatualizado aparece sozinho depois de 24 horas.

## Configuração (uma vez)

1. Repositório público `atto` no GitHub com o conteúdo desta pasta (sem `dist/`). Público porque o GitHub Pages gratuito exige.
2. Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. O app do Claude no GitHub precisa ter acesso ao repositório `atto` (github.com/settings/installations > Claude > Repository access).
4. Rotina diária no claude.ai/code com o repositório `atto` como fonte e o prompt de `docs/ROTINA.md`.

Endereço: `https://<usuario>.github.io/atto/`.

## Depois

- Domínio próprio: Settings > Pages > Custom domain. O build usa o endereço informado pelo GitHub, sem mudar código. Antes, verifique o domínio e o registro da marca Atto no INPI.
- Métricas sem cookies: Cloudflare Web Analytics funciona em qualquer hospedagem; o token vai em `cloudflare_analytics_token` no `site.config.json`.
