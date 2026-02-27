# Landing Contact And Glow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Aumentar levemente a intensidade do holofote da hero e adicionar contato por e-mail na landing page institucional.

**Architecture:** A intensidade do brilho sera ajustada apenas na regra `.hero-glow`, sem alterar a estrutura da hero. O contato sera inserido no footer, que ja concentra links institucionais e preserva melhor a hierarquia visual da landing.

**Tech Stack:** HTML, CSS, pytest

---

### Task 1: Cobertura de teste

**Files:**
- Create: `tests/test_landing_page.py`
- Test: `tests/test_landing_page.py`

**Step 1: Write the failing test**

Criar testes que validem:
- existencia de `mailto:contato@ratiojuris.me` no footer da landing;
- presenca de brilho reforcado em `.hero-glow` dentro de `styles.css`.

**Step 2: Run test to verify it fails**

Run: `py -m pytest -q tests/test_landing_page.py`
Expected: FAIL porque o footer ainda nao tem o e-mail e o glow ainda esta no valor antigo.

### Task 2: Implementacao minima

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Step 3: Write minimal implementation**

Adicionar um bloco/linha de contato no footer com `mailto:contato@ratiojuris.me` e elevar a opacidade do `radial-gradient` de `.hero-glow`.

**Step 4: Run test to verify it passes**

Run: `py -m pytest -q tests/test_landing_page.py`
Expected: PASS

### Task 3: Verificacao final

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/test_landing_page.py`

**Step 5: Run focused verification**

Run:
- `py -m pytest -q tests/test_landing_page.py`
- `git diff -- index.html styles.css tests/test_landing_page.py`

Expected: tudo verde e diff restrito a landing.
