const downloads = [
  {
    channel: "Estável",
    platform: "Windows x64",
    version: "v2026.02.27",
    size: "Completo",
    notes: "Baixe o arquivo ZIP completo pelo link do Google Drive fornecido, descompacte na sua máquina e inicie pelo Ratio.exe.",
    primaryUrl: "https://drive.google.com/file/d/1fHNvcpugTT9b2y2C1F193HefmxhO9hmM/view?usp=sharing",
    primaryLabel: "↓ Baixar no Google Drive",
    secondaryUrl: "https://github.com/carlosvictorodrigues/ratio",
    secondaryLabel: "Repositório"
  },
  {
    channel: "Documentação",
    platform: "Guia de uso & Código-fonte",
    version: "Atual",
    size: "online",
    notes: "Acesse o repositório principal no GitHub para a documentação completa, README e código-fonte.",
    primaryUrl: "https://github.com/carlosvictorodrigues/ratio#readme",
    primaryLabel: "↗ Ver Documentação",
    secondaryUrl: "https://github.com/carlosvictorodrigues/ratio",
    secondaryLabel: "GitHub"
  }
];

function renderDownloads() {
  const list = document.getElementById("downloadsList");
  if (!list) return;
  downloads.forEach(item => {
    const card = document.createElement("div");
    card.className = "dl-card";
    card.innerHTML = `
      <div class="dl-card-header">
        <div class="dl-title">${item.platform}</div>
        <span class="dl-badge">${item.channel}</span>
      </div>
      <p class="dl-meta">${item.version} · ${item.size}</p>
      <p class="dl-notes">${item.notes}</p>
      <div class="dl-actions">
        <a class="dl-btn-primary" href="${item.primaryUrl}" target="_blank" rel="noopener noreferrer">${item.primaryLabel}</a>
        <a class="dl-btn-secondary" href="${item.secondaryUrl}" target="_blank" rel="noopener noreferrer">${item.secondaryLabel}</a>
      </div>
    `;
    list.appendChild(card);
  });
}

function copyPix() {
  const input = document.getElementById("pixKeyInput");
  const btnText = document.getElementById("pixCopyText");
  if (!input || !btnText) return;
  navigator.clipboard.writeText(input.value).then(() => {
    const original = btnText.textContent;
    btnText.textContent = "Copiado!";
    setTimeout(() => (btnText.textContent = original), 2000);
  }).catch(() => {
    input.select();
    document.execCommand("copy");
  });
}

// Nav scroll effect
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    nav.style.borderBottomColor = "rgba(255,255,255,0.1)";
  } else {
    nav.style.borderBottomColor = "rgba(255,255,255,0.06)";
  }
}, { passive: true });

// Intersection observer for section reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".section").forEach(el => {
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  observer.observe(el);
});

// Also reveal statsbar
const statsbar = document.querySelector(".statsbar");
if (statsbar) {
  statsbar.style.transition = "opacity 0.6s ease";
  statsbar.style.opacity = "0";
  observer.observe(statsbar);
  // fix for statsbar (no transform)
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = "1"; });
  }, { threshold: 0.1 });
  statsObs.observe(statsbar);
}

renderDownloads();

