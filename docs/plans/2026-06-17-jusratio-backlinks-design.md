# Design — Backlinks e captação para o Jusratio (2026-06-17)

## Contexto

Quando se pesquisa "jusratio" no Google, o resumo de IA aponta usuários tanto para o `jusratio.com.br` quanto para o site do Ratio (`ratiojuris.me`). O domínio `ratiojuris.me` já tem relevância/indexação consolidada no Google. A equipe (Anderson, Mario, Carlos Victor) decidiu usar o site do Ratio para:

1. **Capturar tráfego** que o Google possa estar mandando para o Ratio e direcioná-lo ao Jusratio.
2. **Gerar backlinks dofollow** do `ratiojuris.me` para o `jusratio.com.br`, fortalecendo a relevância do Jusratio no algoritmo de busca.

Requisito crítico levantado pelo Anderson: **os links para o Jusratio NÃO podem ter `rel="nofollow"`** — caso contrário o Google não computa o link para ranqueamento.

## Objetivo

Inserir, no site do Ratio, pontos de saída para o Jusratio que (a) convertam visitantes e (b) funcionem como backlinks dofollow, sem degradar a experiência nem a estética do site.

## Posicionamento aprovado

**"O Ratio evoluiu → Jusratio."** O Jusratio é a plataforma de IA jurídica na nuvem (fontes verificáveis, controle de vigência/overruling, personas de resposta, integração MCP com Claude/ChatGPT/Gemini). O Ratio continua existindo como o app **local e gratuito** focado em privacidade. Tom de evolução, nunca de "fim do Ratio".

## Componentes

### 1. Barra fixa no topo (banner)

- Barra fina (~40px) fixa **acima** da navegação, visível em todas as páginas e em toda a rolagem.
- Estética **monocromática**, coerente com o site (fundo escuro `#17150f`, hairlines em `rgba(255,255,255,0.08–0.09)`, texto cream, link em branco sublinhado).
- Mensagem desktop: `✦ O Ratio evoluiu — conheça o [Jusratio], a IA jurídica na nuvem →`.
- Mensagem mobile: versão curta (`O Ratio evoluiu → conheça o [Jusratio]`).
- Botão `×` à direita que **oculta a barra por sessão** via `localStorage`.
- O link aponta **direto** para `https://jusratio.com.br` (backlink dofollow).

**SEO:** a barra nasce **presente e visível no HTML servido**. O `×` só aplica `display:none` em runtime após interação do usuário; o crawler do Google sempre vê o link no HTML/DOM inicial.

### 2. Popup de entrada (substitui o modal de versão)

- Reaproveita a estrutura visual do modal `.announce-*` existente.
- Substitui o atual modal "NOVA VERSÃO" (que aponta para a v2026.03.20, já desatualizada). O modal de versão é **aposentado**.
- Conteúdo:
  - Badge: `EVOLUÇÃO`.
  - Título (serif): `Conheça o Jusratio`.
  - Subtítulo: `O Ratio evoluiu para a nuvem. O app local continua gratuito — e agora há a plataforma completa.`
  - 3 diferenciais: **Fontes verificáveis** · **Controle de vigência (overruling)** · **Integração com LLMs (Claude, ChatGPT e Gemini)**.
  - **Apenas um botão**: CTA primário `Conhecer o Jusratio →` apontando para `https://jusratio.com.br`. O `×` no canto faz o papel de fechar (não há botão secundário "Continuar no Ratio").
- Aparece **uma vez por visitante**, com `localStorage` (nova chave, ex.: `ratio_jusratio_popup_v1`) e o mesmo delay de ~800ms da lógica atual em `app.js`.

### 3. Página de transição `/jusratio.html` (ativo de SEO)

- Página real no mesmo domínio indexado: `https://ratiojuris.me/jusratio.html`.
- Reaproveita `styles.css`, a navegação e o footer (mesmos componentes do `index.html`).
- Conteúdo (com **múltiplos links contextuais dofollow** para `jusratio.com.br`, usando âncoras variadas e ricas em palavra-chave):
  - H1: `O Ratio evoluiu: conheça o Jusratio`.
  - A evolução Ratio → Jusratio (o porquê).
  - O que o Jusratio faz (fontes verificáveis, controle de vigência, personas, integração MCP/nuvem).
  - Como o Ratio se encaixa (app local, gratuito, privacidade).
  - CTAs para `jusratio.com.br` (ex.: conhecer planos / versão gratuita).
- `<head>`: `<title>` e `<meta name="description">` com palavras-chave; `<link rel="canonical">`; Open Graph básico.
- **Links internos**: a página é alcançável a partir de um item `Jusratio` na **nav** e no **footer** do `index.html` (apontando para `/jusratio.html`), para o Google descobrir e crawlear a página.

### 4. `sitemap.xml`

- Arquivo novo na raiz, listando `https://ratiojuris.me/` e `https://ratiojuris.me/jusratio.html`, para acelerar a descoberta/crawl da nova página.

## Garantia de dofollow (requisito crítico)

- Todos os links para o Jusratio usam, no máximo, `target="_blank" rel="noopener"`. **Nunca** `nofollow`, `ugc` ou `sponsored`.
- `rel="noopener"` (já usado no site) **não** bloqueia link equity — apenas `nofollow` bloquearia.
- Âncoras descritivas e variadas na página de transição (diversidade de texto-âncora favorece o ranqueamento).

## Mapa de links (resumo)

| Origem | Destino | Tipo |
|---|---|---|
| Barra do topo | `jusratio.com.br` | externo, dofollow |
| Popup (CTA) | `jusratio.com.br` | externo, dofollow |
| Nav `Jusratio` | `/jusratio.html` | interno |
| Footer `Jusratio` | `/jusratio.html` | interno |
| Página de transição (vários) | `jusratio.com.br` | externo, dofollow |

## Considerações técnicas

**Offset do topo (parte mais delicada).** Hoje `.nav` é `position:fixed; top:0` e o hero compensa a altura da nav. Com a barra no topo:
- Introduzir `--topbar-h` (altura da barra) e deslocar `.nav { top: var(--topbar-h) }`.
- Compensar o offset inicial do conteúdo/hero e o offset de âncora do scroll (a nav com `scroll-behavior: smooth` salta para `#sobre`, `#downloads` etc.; é preciso garantir que os títulos não fiquem escondidos atrás de barra+nav).
- Ao ocultar a barra (via `×`), recolher o offset para não deixar faixa vazia.
- A página `/jusratio.html` herda a mesma barra+nav e, portanto, o mesmo offset.

## Arquivos afetados

- `index.html` — markup da barra do topo; item `Jusratio` na nav e no footer; conteúdo do modal repurposed (versão → Jusratio).
- `styles.css` — `.jr-topbar` e responsividade; ajuste de `top` da nav e do offset do hero; reaproveitamento dos estilos `.announce-*`.
- `app.js` — nova chave de `localStorage` do popup; dismiss da barra por sessão; remoção/ajuste da lógica do antigo modal de versão.
- `jusratio.html` — **novo**, página de SEO.
- `sitemap.xml` — **novo**.
- `tests/` — novos testes (ver abaixo).

## Estratégia de testes

Seguindo o padrão Python já existente em `tests/test_landing_page.py` (asserts sobre o conteúdo de HTML/CSS):

1. **Barra existe** e contém link para `jusratio.com.br`.
2. **Nenhum link para `jusratio.com.br`** (no `index.html` e no `jusratio.html`) contém `nofollow` — guarda automática contra o erro que o Anderson alertou.
3. **Popup** aponta para `jusratio.com.br` e **não** contém botão "Continuar no Ratio"; o antigo modal de versão foi removido/repurposed.
4. **`jusratio.html` existe**, tem `<h1>`, `<link rel="canonical">`, `<meta name="description">` e links dofollow.
5. **Nav e footer** do `index.html` linkam para `/jusratio.html`.
6. **`sitemap.xml` existe** e lista as duas URLs.

## Fora de escopo (YAGNI)

- Redesenho visual do site fora da barra/popup/página.
- A/B testing, analytics ou rastreamento de cliques.
- `robots.txt` (GitHub Pages serve o site sem bloqueios; o `sitemap.xml` já cobre a descoberta).
- Variante de barra invertida (fundo claro) — registrada como opção, mas não será implementada salvo pedido.
