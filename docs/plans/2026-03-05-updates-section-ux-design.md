# UX Design - Atualizacoes da Landing (2026-03-05)

## Contexto
A secao `#atualizacoes` da landing estava com alta densidade textual em cards equivalentes, sem hierarquia clara entre release atual e historico. O objetivo aprovado foi priorizar leitura rapida da versao atual.

## Objetivo
Destacar a release atual em primeiro plano e reduzir carga cognitiva no restante do historico, mantendo rastreabilidade tecnica.

## Abordagem Aprovada
**Release Spotlight + Historico recolhido**

- Um bloco principal para a versao atual, aberto e visivel por padrao.
- Historico em itens recolhidos por padrao (`details/summary`), ordenados do mais novo para o mais antigo.
- Conteudo da versao atual resumido em bullets de impacto (maximo de 6 linhas).

## Estrutura de Interface

### 1. Cabecalho da secao
- Mantem titulo e subtitulo da secao para consistencia da landing.
- Acrescenta microcopy focada em "ultima versao primeiro".

### 2. Card principal de versao atual
- Titulo: `Versao atual - v2026.03.05`.
- Subtitulo de impacto em 1 frase.
- Chips de contexto: `Estavel`, `Windows x64`, `Atualizado em 05/03/2026`.
- Lista curta de mudancas prioritarias para o usuario final.

### 3. Historico de versoes
- Cada versao antiga vira item colapsavel.
- `summary` exibe versao + tema + data.
- Corpo interno conserva patch notes detalhadas, sem perder informacao.

## Comportamento e Interacao
- Apenas a versao atual fica aberta por padrao.
- Itens historicos iniciam fechados.
- Navegacao por teclado e leitores de tela se beneficia de `details/summary` nativo.

## Diretrizes visuais
- Card atual com maior contraste e destaque visual.
- Historico com contraste moderado para nao competir com o card principal.
- Melhor legibilidade para listas longas: largura controlada, espacamento entre bullets e hierarquia de tipografia.

## Implementacao Tecnica
- HTML:
  - Introduzir bloco `updates-current` para versao ativa.
  - Migrar patch notes antigos para estrutura `details.update-item`.
- CSS:
  - Novos estilos para destaque da release atual.
  - Estilos de acordeao e estados aberto/fechado.
  - Ajustes responsivos para mobile (evitar cards muito altos com texto corrido).
- JS:
  - Nenhuma dependencia obrigatoria; comportamento nativo do browser cobre o colapso.

## Riscos e Mitigacoes
- Risco: esconder demais o historico.
  - Mitigacao: manter summaries informativos (versao + tema + data).
- Risco: card atual muito grande em telas pequenas.
  - Mitigacao: limitar quantidade de bullets e ajustar paddings em breakpoint.

## Testes e Verificacao
- Testes de contrato do frontend (strings/chaves) atualizados quando necessario.
- Validacao visual manual desktop + mobile.
- Confirmar que o bloco da versao atual aparece primeiro e que o historico inicia fechado.

## Resultado Esperado
A secao de Atualizacoes comunica em segundos "o que mudou agora" e preserva o historico completo sem ruido visual.
