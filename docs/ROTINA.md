# Rotina diária "Atto: relatório de ofertas"

Rotina do Claude Code (claude.ai/code/routines), todo dia às 09:00 de Brasília (`0 12 * * *` em UTC), com o repositório `atto` como fonte.

O prompt completo não fica neste repositório, que é público: ele contém dados pessoais do responsável. Ele é o prompt da rotina anterior ("Web Discount Searcher") com estas mudanças:

- Exceção de segurança: só pode gravar em `data/`, fazer commit e push.
- COMPRAR HOJE exige preço revalidado em até 24 horas (antes, 48), igual ao limite de dado desatualizado do site.
- O relatório anterior é lido de `data/relatorio.json`.
- ENTREGA FINAL: grava `data/relatorios/AAAA-MM-DD.md`, converte para `data/relatorio.json` conforme `docs/RELATORIO.md`, copia para `data/arquivo/`, roda build e teste, faz push de um ramo `claude/relatorio-AAAA-MM-DD`. Preço sem data e hora conhecidas fica fora do JSON.

O workflow `integrar-relatorio.yml` rejeita qualquer mudança fora de `data/` vinda da rotina. É a proteção caso uma página lida durante a pesquisa tente induzir a rotina a alterar o código do site.
