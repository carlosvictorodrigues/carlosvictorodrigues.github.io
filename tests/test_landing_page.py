from pathlib import Path


def _read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def test_footer_has_public_contact_email():
    html = _read("index.html")
    footer = html.split('<footer class="footer">', 1)[1].split("</footer>", 1)[0]

    assert "Contato" in footer
    assert 'href="mailto:contato@ratiojuris.me"' in footer


def test_hero_glow_intensity_is_strengthened():
    css = _read("styles.css")
    hero_glow = css.split(".hero-glow", 1)[1].split(".hero-eyebrow", 1)[0]

    assert "rgba(255, 255, 255, 0.12)" in hero_glow


def test_footer_contact_uses_same_typography_family_as_footer_links():
    css = _read("styles.css")
    footer_contact = css.split(".footer-contact", 1)[1].split(".footer-copy", 1)[0]

    assert "font-family: var(--font-body);" in footer_contact
    assert "font-size: 12px;" in footer_contact
    assert "text-transform: none;" in footer_contact
    assert "font-family: inherit;" in footer_contact
    assert "font-size: inherit;" in footer_contact


def test_updates_section_prioritizes_current_release_and_collapsible_history():
    html = _read("index.html")
    updates = html.split('id="atualizacoes"', 1)[1].split("</section>", 1)[0]

    assert 'class="updates-current"' in updates
    assert "Versao atual" in updates
    assert 'class="update-chip"' in updates
    assert '<details class="update-history-item"' in updates


def test_updates_section_has_spotlight_and_history_styles():
    css = _read("styles.css")
    assert ".updates-current {" in css
    assert ".update-chip {" in css
    assert ".update-history-item {" in css
    assert ".update-history-item summary" in css
