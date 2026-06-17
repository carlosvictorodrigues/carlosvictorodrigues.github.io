# Jusratio Backlinks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar ao site do Ratio (`ratiojuris.me`) uma barra fixa no topo, um popup de entrada (substituindo o modal de versão) e uma página `/jusratio.html`, todos com links dofollow para `jusratio.com.br`, para capturar tráfego e gerar backlinks de SEO.

**Architecture:** Site estático (GitHub Pages): `index.html` + `styles.css` + `app.js`, mais uma nova página `jusratio.html` e um `sitemap.xml`. A barra do topo usa uma CSS custom property `--topbar-h` que controla, de uma só vez, o `top` da nav fixa, o padding do hero e o `scroll-padding-top` dos âncoras; ao fechar a barra, um script zera `--topbar-h` e o layout se recolhe sozinho. Testes em pytest (mesmo padrão de `tests/test_landing_page.py`) garantem a estrutura e, sobretudo, que nenhum link para o Jusratio leve `nofollow`.

**Tech Stack:** HTML, CSS, JavaScript vanilla, pytest (asserts sobre conteúdo de arquivos).

---

## Estrutura de arquivos

- `index.html` — barra do topo + script inline anti-flash; item `Jusratio` na nav e no footer; modal de versão substituído pelo popup do Jusratio; bump de `?v=`.
- `styles.css` — token `--topbar-h`; ajuste de `top` da nav, padding do hero e `scroll-padding-top`; bloco `.jr-topbar`; regras `.topbar-hidden`; responsivo; `.jr-hero`.
- `app.js` — fechar a barra por sessão; popup repurposed (nova chave, sem botão secundário).
- `jusratio.html` — **novo**: página de transição/SEO, reusa nav/footer/estilos.
- `sitemap.xml` — **novo**: lista as duas URLs.
- `tests/test_jusratio_backlinks.py` — **novo**: testes de estrutura + guarda anti-`nofollow`.

Convenção de commit do repo: mensagens curtas em PT-BR (`feat:`/`update:`), terminando com o trailer `Co-Authored-By`.

---

### Task 1: Branch de trabalho

**Files:** nenhum arquivo de código; apenas git.

- [ ] **Step 1: Criar a branch a partir de `main`**

Run:
```bash
git checkout -b feat/jusratio-backlinks
```
Expected: `Switched to a new branch 'feat/jusratio-backlinks'`

- [ ] **Step 2: Commitar os documentos de design/plano (já criados, ainda untracked)**

```bash
git add docs/plans/2026-06-17-jusratio-backlinks-design.md docs/plans/2026-06-17-jusratio-backlinks-implementation.md
git commit -m "docs: design e plano dos backlinks para o Jusratio

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: 1 commit criado com os 2 arquivos.

---

### Task 2: CSS da barra do topo e offset de layout

**Files:**
- Modify: `styles.css` (token em `:root` ~linha 25; `.nav` ~linha 66; `.hero` ~linha 201; `html` ~linha 38; media queries 980px ~linha 1128 e 640px ~linha 1166)
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha (estrutura do CSS)**

Criar `tests/test_jusratio_backlinks.py` com:
```python
import re
from pathlib import Path


def _read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def test_css_defines_topbar_token_and_offset():
    css = _read("styles.css")
    assert "--topbar-h:" in css
    assert ".jr-topbar {" in css
    assert "top: var(--topbar-h)" in css
    assert "scroll-padding-top:" in css
    assert ".topbar-hidden" in css
```

- [ ] **Step 2: Rodar o teste e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_css_defines_topbar_token_and_offset -v`
Expected: FAIL (as strings ainda não existem em `styles.css`).

- [ ] **Step 3: Adicionar o token `--topbar-h` ao `:root`**

Em `styles.css`, dentro de `:root { ... }`, logo após `--radius: 8px;`:
```css
  --radius: 8px;
  --topbar-h: 40px;
```

- [ ] **Step 4: Adicionar `scroll-padding-top` ao `html`**

Substituir o bloco `html { scroll-behavior: smooth; }` por:
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--topbar-h) + 72px);
}
```

- [ ] **Step 5: Deslocar a nav fixa para baixo da barra**

No bloco `.nav { ... }`, trocar `top: 0;` por:
```css
  top: var(--topbar-h);
```

- [ ] **Step 6: Compensar o padding-top do hero**

No bloco `.hero { ... }`, trocar `padding: 120px 28px 80px;` por:
```css
  padding: calc(120px + var(--topbar-h)) 28px 80px;
```

- [ ] **Step 7: Adicionar o bloco de estilos da barra**

Acrescentar ao final de `styles.css`:
```css
/* ─── Top promo bar (Jusratio) ─── */
.jr-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 44px;
  background: #17150f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  font-size: 13px;
  color: #cfcabd;
  overflow: hidden;
}

.jr-topbar-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
}

.jr-topbar-link strong {
  color: var(--white);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.jr-topbar-mark {
  color: #8c8678;
}

.jr-topbar-arrow {
  color: var(--white);
}

.jr-topbar-short {
  display: none;
}

.jr-topbar-close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6f6a5f;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.jr-topbar-close:hover {
  color: var(--white);
  background: rgba(255, 255, 255, 0.06);
}

.topbar-hidden {
  --topbar-h: 0px;
}

.topbar-hidden .jr-topbar {
  display: none;
}

/* Header da página de transição /jusratio.html */
.jr-hero {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: calc(var(--topbar-h) + 132px) 28px 56px;
}
```

- [ ] **Step 8: Regras responsivas (mensagem curta no mobile)**

Dentro da media query `@media (max-width: 640px) { ... }` (a que já esconde `.nav-link`), acrescentar:
```css
  .jr-topbar {
    font-size: 12px;
    padding: 0 38px;
  }

  .jr-topbar-full {
    display: none;
  }

  .jr-topbar-short {
    display: inline;
  }
```

- [ ] **Step 9: Rodar o teste e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_css_defines_topbar_token_and_offset -v`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add styles.css tests/test_jusratio_backlinks.py
git commit -m "feat: estilos da barra do topo e offset de layout (--topbar-h)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Markup da barra no topo + script anti-flash

**Files:**
- Modify: `index.html` (logo após `<body>` ~linha 33)
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `tests/test_jusratio_backlinks.py`:
```python
def _jusratio_anchors(html: str):
    return re.findall(r"<a\b[^>]*jusratio\.com\.br[^>]*>", html)


def test_topbar_exists_and_links_jusratio_dofollow():
    html = _read("index.html")
    assert 'class="jr-topbar"' in html
    assert 'id="jrTopbar"' in html
    anchors = _jusratio_anchors(html)
    assert anchors, "esperava ao menos um link para jusratio.com.br no index.html"
    for a in anchors:
        assert "nofollow" not in a
        assert 'rel="ugc"' not in a
        assert "sponsored" not in a
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_topbar_exists_and_links_jusratio_dofollow -v`
Expected: FAIL (`jr-topbar` ainda não existe).

- [ ] **Step 3: Inserir a barra + script anti-flash logo após `<body>`**

Em `index.html`, imediatamente após a linha `<body>`:
```html
<body>

  <script>try{if(localStorage.getItem("ratio_jusratio_topbar_dismissed_v1"))document.documentElement.classList.add("topbar-hidden")}catch(e){}</script>

  <!-- Top promo bar -->
  <div class="jr-topbar" id="jrTopbar">
    <a class="jr-topbar-link" href="https://jusratio.com.br" target="_blank" rel="noopener">
      <span class="jr-topbar-mark" aria-hidden="true">✦</span>
      <span class="jr-topbar-full">O Ratio evoluiu — conheça o <strong>Jusratio</strong>, a IA jurídica na nuvem</span>
      <span class="jr-topbar-short">O Ratio evoluiu → conheça o <strong>Jusratio</strong></span>
      <span class="jr-topbar-arrow" aria-hidden="true">→</span>
    </a>
    <button class="jr-topbar-close" id="jrTopbarClose" aria-label="Fechar aviso">&times;</button>
  </div>
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_topbar_exists_and_links_jusratio_dofollow -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/test_jusratio_backlinks.py
git commit -m "feat: barra fixa no topo com link dofollow para o Jusratio

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Fechar a barra por sessão (app.js)

**Files:**
- Modify: `app.js` (acrescentar IIFE ao final, após o bloco do modal ~linha 128)
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar:
```python
def test_appjs_has_topbar_dismiss_logic():
    js = _read("app.js")
    assert "jrTopbar" in js
    assert "ratio_jusratio_topbar_dismissed_v1" in js
    assert "topbar-hidden" in js
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_appjs_has_topbar_dismiss_logic -v`
Expected: FAIL

- [ ] **Step 3: Acrescentar a lógica ao final de `app.js`**

```javascript
// ── Top promo bar dismiss ──
(function () {
  const TOPBAR_KEY = "ratio_jusratio_topbar_dismissed_v1";
  const closeBtn = document.getElementById("jrTopbarClose");
  if (!closeBtn) return;
  closeBtn.addEventListener("click", function () {
    document.documentElement.classList.add("topbar-hidden");
    try { localStorage.setItem(TOPBAR_KEY, "1"); } catch (_) {}
  });
})();
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_appjs_has_topbar_dismiss_logic -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app.js tests/test_jusratio_backlinks.py
git commit -m "feat: fechar a barra do topo por sessao

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Link interno `Jusratio` na nav e no footer

**Files:**
- Modify: `index.html` (nav-links ~linha 48; footer-links ~linha 583)
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha**

```python
def test_nav_and_footer_link_to_jusratio_page():
    html = _read("index.html")
    nav = html.split('<div class="nav-links">', 1)[1].split("</nav>", 1)[0]
    footer = html.split('<footer class="footer">', 1)[1].split("</footer>", 1)[0]
    assert 'href="./jusratio.html"' in nav
    assert 'href="./jusratio.html"' in footer
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_nav_and_footer_link_to_jusratio_page -v`
Expected: FAIL

- [ ] **Step 3: Adicionar o link na nav**

Em `index.html`, dentro de `<div class="nav-links">`, imediatamente antes da linha `<a href="https://github.com/carlosvictorodrigues/ratio" ... nav-link-gh">`:
```html
        <a href="./jusratio.html" class="nav-link">Jusratio</a>
```

- [ ] **Step 4: Adicionar o link no footer**

Em `index.html`, dentro de `<div class="footer-links">`, após o link do GitHub:
```html
        <a href="./jusratio.html">Jusratio</a>
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_nav_and_footer_link_to_jusratio_page -v`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add index.html tests/test_jusratio_backlinks.py
git commit -m "feat: link interno Jusratio na nav e no footer

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Substituir o modal de versão pelo popup do Jusratio (HTML)

**Files:**
- Modify: `index.html` (bloco `<!-- Update announcement modal -->` ~linhas 598-643)
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha**

```python
def test_version_modal_replaced_by_jusratio_popup():
    html = _read("index.html")
    overlay = html.split('id="announceOverlay"', 1)[1].split("</div>\n  </div>", 1)[0]
    assert "Conheça o Jusratio" in overlay
    assert 'id="announceCta"' in overlay
    assert "jusratio.com.br" in overlay
    # botão secundário e copy de versão removidos
    assert "Já atualizei" not in html
    assert 'id="announceDismiss"' not in html
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_version_modal_replaced_by_jusratio_popup -v`
Expected: FAIL

- [ ] **Step 3: Substituir todo o bloco do modal**

Em `index.html`, substituir o bloco que começa em `<!-- Update announcement modal -->` e termina no `</div>` de fechamento do `announceOverlay` por:
```html
  <!-- Jusratio entry popup -->
  <div class="announce-overlay" id="announceOverlay">
    <div class="announce-modal" id="announceModal">
      <button class="announce-close" id="announceClose" aria-label="Fechar">&times;</button>
      <div class="announce-badge">Evolução</div>
      <h2 class="announce-title">Conheça o Jusratio</h2>
      <p class="announce-sub">O Ratio evoluiu para a nuvem. O app local continua gratuito — e agora há a plataforma completa.</p>
      <div class="announce-features">
        <div class="announce-feat">
          <span class="announce-feat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </span>
          <div>
            <strong>Fontes verificáveis</strong>
            <p>Cada resposta traz processo, relator, data e link direto para o acórdão original.</p>
          </div>
        </div>
        <div class="announce-feat">
          <span class="announce-feat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <div>
            <strong>Controle de vigência</strong>
            <p>Alerta automático de overruling quando uma tese é superada ou modificada.</p>
          </div>
        </div>
        <div class="announce-feat">
          <span class="announce-feat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </span>
          <div>
            <strong>Integração com LLMs</strong>
            <p>Conecte Claude, ChatGPT e Gemini e transforme-os em especialistas em direito.</p>
          </div>
        </div>
      </div>
      <div class="announce-actions">
        <a href="https://jusratio.com.br" target="_blank" rel="noopener" class="btn btn-primary announce-btn" id="announceCta">Conhecer o Jusratio →</a>
      </div>
    </div>
  </div>
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_version_modal_replaced_by_jusratio_popup -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/test_jusratio_backlinks.py
git commit -m "feat: popup de entrada do Jusratio substitui o modal de versao

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Repurpose da lógica do popup (app.js)

**Files:**
- Modify: `app.js` (bloco `// ── Announcement modal ──` ~linhas 104-128)
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha**

```python
def test_appjs_popup_uses_new_key_and_no_secondary_button():
    js = _read("app.js")
    assert "ratio_jusratio_popup_v1" in js
    assert "announceDismiss" not in js
    assert "ratio_announce_dismissed_v2026.03.20" not in js
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_appjs_popup_uses_new_key_and_no_secondary_button -v`
Expected: FAIL

- [ ] **Step 3: Substituir o IIFE do modal**

Em `app.js`, substituir todo o bloco `// ── Announcement modal ──` (a IIFE inteira) por:
```javascript
// ── Jusratio entry popup (replaces old version modal) ──
(function () {
  const POPUP_KEY = "ratio_jusratio_popup_v1";
  const overlay = document.getElementById("announceOverlay");
  const closeBtn = document.getElementById("announceClose");
  const ctaBtn = document.getElementById("announceCta");
  if (!overlay) return;

  function dismiss() {
    overlay.classList.remove("visible");
    try { localStorage.setItem(POPUP_KEY, "1"); } catch (_) {}
  }

  if (closeBtn) closeBtn.addEventListener("click", dismiss);
  if (ctaBtn) ctaBtn.addEventListener("click", dismiss);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) dismiss();
  });

  try {
    if (localStorage.getItem(POPUP_KEY)) return;
  } catch (_) {}
  setTimeout(function () { overlay.classList.add("visible"); }, 800);
})();
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_appjs_popup_uses_new_key_and_no_secondary_button -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app.js tests/test_jusratio_backlinks.py
git commit -m "feat: logica do popup do Jusratio (nova chave, sem botao secundario)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Página de transição `/jusratio.html`

**Files:**
- Create: `jusratio.html`
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever os testes que falham**

```python
def test_jusratio_page_exists_with_seo_basics():
    html = _read("jusratio.html")
    assert "<h1" in html
    assert 'rel="canonical"' in html
    assert "https://ratiojuris.me/jusratio.html" in html
    assert '<meta name="description"' in html
    assert html.count("jusratio.com.br") >= 3


def test_jusratio_page_links_are_dofollow():
    html = _read("jusratio.html")
    anchors = _jusratio_anchors(html)
    assert len(anchors) >= 3
    for a in anchors:
        assert "nofollow" not in a
        assert 'rel="ugc"' not in a
        assert "sponsored" not in a
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py -k jusratio_page -v`
Expected: FAIL (arquivo não existe).

- [ ] **Step 3: Criar `jusratio.html`**

Conteúdo completo (reusa `styles.css`, nav, footer e `app.js`; **não** inclui o modal nem `rag-animation.js`):
```html
<!doctype html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Do Ratio ao Jusratio — a evolução da pesquisa jurídica com IA</title>
  <meta name="description"
    content="O Ratio evoluiu para o Jusratio, a plataforma de IA jurídica na nuvem: fontes verificáveis, controle de vigência (overruling), personas de resposta e integração com Claude, ChatGPT e Gemini." />
  <link rel="canonical" href="https://ratiojuris.me/jusratio.html" />
  <meta property="og:title" content="Do Ratio ao Jusratio — a evolução da pesquisa jurídica com IA" />
  <meta property="og:description" content="O Ratio evoluiu para o Jusratio, a plataforma de IA jurídica na nuvem." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ratiojuris.me/jusratio.html" />
  <meta property="og:image" content="https://ratiojuris.me/og-image.png?v=2" />
  <link rel="icon" href="./favicon.ico" />
  <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Sans:wght@400;500;600&display=swap"
    rel="stylesheet" />
  <link rel="stylesheet" href="./styles.css?v=2026.06.17" />
</head>

<body>

  <script>try{if(localStorage.getItem("ratio_jusratio_topbar_dismissed_v1"))document.documentElement.classList.add("topbar-hidden")}catch(e){}</script>

  <!-- Top promo bar -->
  <div class="jr-topbar" id="jrTopbar">
    <a class="jr-topbar-link" href="https://jusratio.com.br" target="_blank" rel="noopener">
      <span class="jr-topbar-mark" aria-hidden="true">✦</span>
      <span class="jr-topbar-full">O Ratio evoluiu — conheça o <strong>Jusratio</strong>, a IA jurídica na nuvem</span>
      <span class="jr-topbar-short">O Ratio evoluiu → conheça o <strong>Jusratio</strong></span>
      <span class="jr-topbar-arrow" aria-hidden="true">→</span>
    </a>
    <button class="jr-topbar-close" id="jrTopbarClose" aria-label="Fechar aviso">&times;</button>
  </div>

  <!-- Navigation -->
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="./index.html" class="nav-logo">
        <img src="./apple-touch-icon.png" alt="Ratio" class="nav-logo-img" />
        <span class="nav-logo-text">RATIO</span>
      </a>
      <div class="nav-links">
        <a href="./index.html#sobre" class="nav-link">Sobre</a>
        <a href="./index.html#funcionalidades" class="nav-link">Funcionalidades</a>
        <a href="./index.html#downloads" class="nav-link">Download</a>
        <a href="./jusratio.html" class="nav-link">Jusratio</a>
        <a href="https://jusratio.com.br" target="_blank" rel="noopener" class="nav-link nav-link-gh">Acessar Jusratio ↗</a>
      </div>
    </div>
  </nav>

  <!-- Header -->
  <header class="jr-hero">
    <p class="section-eyebrow">Ratio → Jusratio</p>
    <h1 class="section-title">O Ratio evoluiu: conheça o Jusratio.</h1>
    <p class="section-body">
      O Ratio nasceu como um assistente de pesquisa jurisprudencial 100% offline. Essa pesquisa virou uma plataforma
      maior: o <a href="https://jusratio.com.br" target="_blank" rel="noopener"><strong>Jusratio</strong></a>, uma
      inteligência artificial jurídica na nuvem, desenhada para mitigar alucinações e atuar como assistente
      especializado em jurisprudência e legislação brasileira.
    </p>
    <div class="hero-actions" style="margin-top: 28px;">
      <a href="https://jusratio.com.br" target="_blank" rel="noopener" class="btn btn-primary">Conhecer o Jusratio →</a>
      <a href="./index.html" class="btn btn-ghost">Voltar ao Ratio</a>
    </div>
  </header>

  <!-- O que mudou -->
  <section class="section">
    <div class="section-inner">
      <p class="section-eyebrow">O que muda para você</p>
      <h2 class="section-title">A mesma origem, agora na nuvem.</h2>
      <p class="section-body">
        O <strong>Ratio</strong> continua disponível como aplicativo local e gratuito, com foco em privacidade — ele
        processa buscas no seu próprio computador, em um acervo de mais de 1,1 milhão de documentos. O
        <a href="https://jusratio.com.br" target="_blank" rel="noopener">Jusratio</a> leva essa mesma proposta para a
        nuvem, com recursos que só fazem sentido em uma plataforma conectada e sempre atualizada.
      </p>
    </div>
  </section>

  <!-- O que o Jusratio faz -->
  <section class="section section-dark">
    <div class="section-inner">
      <p class="section-eyebrow light">A plataforma</p>
      <h2 class="section-title light">O que a plataforma de IA jurídica do Jusratio faz.</h2>
      <div class="features-grid">
        <div class="feat-card">
          <h3>Fontes verificáveis</h3>
          <p>Cada resposta inclui número do processo, relator, data e link direto para o acórdão original.</p>
        </div>
        <div class="feat-card">
          <h3>Controle de vigência</h3>
          <p>Alerta automático de overruling, indicando quando uma tese ou decisão foi superada ou modificada.</p>
        </div>
        <div class="feat-card">
          <h3>Personas de resposta</h3>
          <p>Configure a IA com formatos como Visão Geral, Estudos, Parecer ou Petição.</p>
        </div>
        <div class="feat-card">
          <h3>Integração com LLMs (MCP)</h3>
          <p>Conecte Claude, ChatGPT e Gemini ao servidor MCP e transforme IAs genéricas em especialistas jurídicos.</p>
        </div>
      </div>
      <div class="hero-actions" style="margin-top: 36px;">
        <a href="https://jusratio.com.br" target="_blank" rel="noopener" class="btn btn-primary">Ver planos e versão gratuita →</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="./apple-touch-icon.png" alt="Ratio" class="footer-logo" />
        <span>RATIO · Pesquisa Jurisprudencial</span>
      </div>
      <div class="footer-links">
        <a href="./index.html">Ratio (app local)</a>
        <a href="https://jusratio.com.br" target="_blank" rel="noopener">Jusratio</a>
        <a href="https://github.com/carlosvictorodrigues/ratio" target="_blank" rel="noopener">GitHub</a>
      </div>
      <div class="footer-contact">
        <span class="footer-contact-label">Contato</span>
        <a href="mailto:contato@ratiojuris.me" class="footer-contact-link">contato@ratiojuris.me</a>
      </div>
      <p class="footer-copy">ratiojuris.me · Software Livre · Gratuito</p>
    </div>
  </footer>

  <script src="./app.js?v=2026.06.17"></script>
</body>

</html>
```

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `python -m pytest tests/test_jusratio_backlinks.py -k jusratio_page -v`
Expected: PASS (ambos)

- [ ] **Step 5: Commit**

```bash
git add jusratio.html tests/test_jusratio_backlinks.py
git commit -m "feat: pagina de transicao /jusratio.html para SEO e backlinks

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: `sitemap.xml`

**Files:**
- Create: `sitemap.xml`
- Test: `tests/test_jusratio_backlinks.py`

- [ ] **Step 1: Escrever o teste que falha**

```python
def test_sitemap_lists_both_pages():
    xml = _read("sitemap.xml")
    assert "https://ratiojuris.me/" in xml
    assert "https://ratiojuris.me/jusratio.html" in xml
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_sitemap_lists_both_pages -v`
Expected: FAIL

- [ ] **Step 3: Criar `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ratiojuris.me/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ratiojuris.me/jusratio.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `python -m pytest tests/test_jusratio_backlinks.py::test_sitemap_lists_both_pages -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add sitemap.xml tests/test_jusratio_backlinks.py
git commit -m "feat: sitemap.xml com index e pagina do Jusratio

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 10: Cache-bust, suíte completa e verificação manual

**Files:**
- Modify: `index.html` (3 query strings `?v=2026.03.20` ~linhas 30, 645, 646)

- [ ] **Step 1: Atualizar os `?v=` do `index.html`**

Em `index.html`, trocar as três ocorrências de `?v=2026.03.20` por `?v=2026.06.17`:
- `<link rel="stylesheet" href="./styles.css?v=2026.06.17" />`
- `<script src="./app.js?v=2026.06.17"></script>`
- `<script src="./rag-animation.js?v=2026.06.17"></script>`

- [ ] **Step 2: Rodar a suíte de testes inteira**

Run: `python -m pytest tests/ -v`
Expected: todos passam (os testes antigos de `test_landing_page.py` + os novos de `test_jusratio_backlinks.py`).

- [ ] **Step 3: Verificação manual (abrir o site localmente)**

Run: `python -m http.server 8000`
Abrir `http://localhost:8000/` e conferir:
- A barra fina aparece no topo, acima da nav; o conteúdo do hero não fica escondido atrás dela.
- Clicar nos itens da nav (`Sobre`, `Download`…) rola até a seção sem que o título fique sob a barra+nav.
- Fechar a barra no `×`: ela some, a nav sobe para o topo e não sobra faixa vazia; ao recarregar, continua fechada.
- O popup do Jusratio aparece após ~0,8s (em aba anônima/sem localStorage), com **um único** botão; o `×` fecha; ao recarregar, não reaparece.
- Abrir `http://localhost:8000/jusratio.html`: barra + nav + footer presentes, links para o Jusratio funcionando, layout correto.
- Mobile (DevTools ≤640px): a barra mostra a mensagem curta; a nav esconde os links como antes.

- [ ] **Step 4: Commit final**

```bash
git add index.html
git commit -m "chore: cache-bust dos assets (v2026.06.17)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notas de SEO (não-código, para a equipe)

- Após o deploy (merge em `main`), enviar o `sitemap.xml` no Google Search Console de `ratiojuris.me` e pedir indexação de `/jusratio.html` para acelerar.
- Os backlinks só "pesam" depois que o Google re-rastrear as páginas; pode levar de dias a algumas semanas.
- Nenhum link para `jusratio.com.br` deve receber `rel="nofollow"` em futuras edições — o teste `test_*_dofollow` falha de propósito se isso acontecer.
