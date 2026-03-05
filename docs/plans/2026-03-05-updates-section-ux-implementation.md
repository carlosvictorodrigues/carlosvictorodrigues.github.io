# Updates Section UX Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesenhar a secao "Atualizacoes" para destacar a versao atual e recolher o historico, priorizando leitura rapida.

**Architecture:** A secao sera dividida em dois blocos: um destaque principal da release ativa e um historico colapsavel baseado em `details/summary`. A implementacao sera feita com HTML sem dependencia JS adicional para interacao, e com CSS dedicado para hierarquia visual, contraste e responsividade.

**Tech Stack:** HTML5 (`index.html`), CSS (`styles.css`), pytest de contrato textual (`tests/test_landing_page.py`).

---

### Task 1: Cobrir o novo contrato de markup para Atualizacoes

**Files:**
- Modify: `tests/test_landing_page.py`
- Test: `tests/test_landing_page.py`

**Step 1: Write the failing test**

```python
def test_updates_section_prioritizes_current_release_and_collapsible_history():
    html = _read("index.html")
    updates = html.split('id="atualizacoes"', 1)[1].split('</section>', 1)[0]

    assert 'class="updates-current"' in updates
    assert 'Versao atual' in updates
    assert 'class="update-chip"' in updates
    assert '<details class="update-history-item"' in updates
```

**Step 2: Run test to verify it fails**

Run: `py -m pytest tests/test_landing_page.py::test_updates_section_prioritizes_current_release_and_collapsible_history -q`
Expected: FAIL por ausencia dos novos seletores/estrutura.

**Step 3: Write minimal implementation**

Sem implementacao nesta task (somente teste red).

**Step 4: Run test to verify it fails correctly**

Run novamente o mesmo comando e confirmar falha pelo motivo certo.

**Step 5: Commit**

```bash
git add tests/test_landing_page.py
git commit -m "test: define contract for updates spotlight and history accordion"
```

### Task 2: Implementar estrutura HTML com release atual em destaque

**Files:**
- Modify: `index.html`
- Test: `tests/test_landing_page.py`

**Step 1: Write the failing test**

Usar o teste da Task 1 (ja falhando) como guia de implementacao.

**Step 2: Run test to verify it fails**

Run: `py -m pytest tests/test_landing_page.py::test_updates_section_prioritizes_current_release_and_collapsible_history -q`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Inserir bloco `div.updates-current` no topo da secao.
- Adicionar titulo/subtitulo curtos e chips (`update-chip`).
- Migrar patch notes antigos para `details.update-history-item > summary`.

**Step 4: Run test to verify it passes**

Run: `py -m pytest tests/test_landing_page.py::test_updates_section_prioritizes_current_release_and_collapsible_history -q`
Expected: PASS.

**Step 5: Commit**

```bash
git add index.html tests/test_landing_page.py
git commit -m "feat: spotlight current release and collapse update history"
```

### Task 3: Refinar visual e responsividade da nova hierarquia

**Files:**
- Modify: `styles.css`
- Test: `tests/test_landing_page.py`

**Step 1: Write the failing test**

Adicionar asserts de classes-chave no CSS:

```python
def test_updates_section_has_spotlight_and_history_styles():
    css = _read("styles.css")
    assert ".updates-current" in css
    assert ".update-chip" in css
    assert ".update-history-item" in css
    assert ".update-history-item summary" in css
```

**Step 2: Run test to verify it fails**

Run: `py -m pytest tests/test_landing_page.py::test_updates_section_has_spotlight_and_history_styles -q`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Criar estilos para `updates-current`, chips e destaque da versao atual.
- Estilizar `details/summary` do historico com estados aberto/fechado.
- Ajustar breakpoints para manter leitura no mobile.

**Step 4: Run test to verify it passes**

Run: `py -m pytest tests/test_landing_page.py::test_updates_section_has_spotlight_and_history_styles -q`
Expected: PASS.

**Step 5: Commit**

```bash
git add styles.css tests/test_landing_page.py
git commit -m "style: improve updates section readability and hierarchy"
```

### Task 4: Verificacao final de regressao e entrega

**Files:**
- Verify only: `index.html`, `styles.css`, `tests/test_landing_page.py`

**Step 1: Run full test suite**

Run: `py -m pytest -q`
Expected: all PASS.

**Step 2: Manual visual check**

- Desktop: secao mostra primeiro a versao atual.
- Mobile: historico colapsado sem overflow lateral.

**Step 3: Commit final (se houver ajustes finais)**

```bash
git add index.html styles.css tests/test_landing_page.py
git commit -m "chore: finalize updates section UX refresh"
```

**Step 4: Push**

```bash
git push
```
