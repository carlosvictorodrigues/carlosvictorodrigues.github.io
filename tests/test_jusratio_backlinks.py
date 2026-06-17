import re
from pathlib import Path


def _read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def _jusratio_anchors(html: str):
    return re.findall(r"<a\b[^>]*jusratio\.com\.br[^>]*>", html)


def test_css_defines_topbar_token_and_offset():
    css = _read("styles.css")
    assert "--topbar-h:" in css
    assert ".jr-topbar {" in css
    assert "top: var(--topbar-h)" in css
    assert "scroll-padding-top:" in css
    assert ".topbar-hidden" in css


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


def test_appjs_has_topbar_dismiss_logic():
    js = _read("app.js")
    assert "jrTopbar" in js
    assert "ratio_jusratio_topbar_dismissed_v1" in js
    assert "topbar-hidden" in js


def test_nav_and_footer_link_to_jusratio_page():
    html = _read("index.html")
    nav = html.split('<div class="nav-links">', 1)[1].split("</nav>", 1)[0]
    footer = html.split('<footer class="footer">', 1)[1].split("</footer>", 1)[0]
    assert 'href="./jusratio.html"' in nav
    assert 'href="./jusratio.html"' in footer


def test_version_modal_replaced_by_jusratio_popup():
    html = _read("index.html")
    overlay = html.split('id="announceOverlay"', 1)[1].split("</div>\n  </div>", 1)[0]
    assert "Conheça o Jusratio" in overlay
    assert 'id="announceCta"' in overlay
    assert "jusratio.com.br" in overlay
    assert "Já atualizei" not in html
    assert 'id="announceDismiss"' not in html


def test_appjs_popup_uses_new_key_and_no_secondary_button():
    js = _read("app.js")
    assert "ratio_jusratio_popup_v1" in js
    assert "announceDismiss" not in js
    assert "ratio_announce_dismissed_v2026.03.20" not in js


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


def test_sitemap_lists_both_pages():
    xml = _read("sitemap.xml")
    assert "https://ratiojuris.me/" in xml
    assert "https://ratiojuris.me/jusratio.html" in xml
