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
