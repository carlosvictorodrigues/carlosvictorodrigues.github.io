const downloads = [
  {
    channel: "Estável",
    platform: "Windows x64",
    version: "v2026.02.25",
    packageSize: "aprox. 13.7 GB (com base local)",
    notes: "Acesse as Releases no GitHub, baixe o arquivo ZIP (pasta dist/Ratio), descompacte-o na sua máquina e inicie pelo Ratio.exe.",
    primaryUrl: "https://github.com/carlosvictorodrigues/ratio/releases",
    secondaryUrl: "https://github.com/carlosvictorodrigues/ratio"
  },
  {
    channel: "Documentação",
    platform: "Guia de uso e Código-fonte",
    version: "Atual",
    packageSize: "online",
    notes: "Acesse o repositório principal do Ratio no GitHub.",
    primaryUrl: "https://github.com/carlosvictorodrigues/ratio",
    secondaryUrl: "https://github.com/carlosvictorodrigues/ratio#readme"
  }
];

function createDownloadCard(item) {
  const card = document.createElement("article");
  card.className = "download-card";

  const title = document.createElement("h3");
  title.className = "download-title";
  title.textContent = `${item.channel} - ${item.platform}`;
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "download-meta";
  meta.textContent = `${item.version} | ${item.packageSize}`;
  card.appendChild(meta);

  const notes = document.createElement("p");
  notes.className = "entry-body";
  notes.textContent = item.notes;
  card.appendChild(notes);

  const actions = document.createElement("div");
  actions.className = "download-actions";

  const primary = document.createElement("a");
  primary.className = "download-link primary";
  primary.href = item.primaryUrl;
  primary.target = "_blank";
  primary.rel = "noopener noreferrer";
  primary.textContent = "Acessar Realeases / Baixar";

  const secondary = document.createElement("a");
  secondary.className = "download-link";
  secondary.href = item.secondaryUrl;
  secondary.target = "_blank";
  secondary.rel = "noopener noreferrer";
  secondary.textContent = "Repositório Principal";

  actions.appendChild(primary);
  actions.appendChild(secondary);
  card.appendChild(actions);

  return card;
}

function render() {
  const downloadsList = document.getElementById("downloadsList");
  if (!downloadsList) return;

  downloads.forEach((entry) => downloadsList.appendChild(createDownloadCard(entry)));
}

function copyPix() {
  const copyText = document.getElementById("pixKeyInput");
  const buttonText = document.getElementById("pixCopyText");
  if (!copyText || !buttonText) return;

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  try {
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Provide user feedback
    const originalText = buttonText.textContent;
    buttonText.textContent = "Copiado!";

    setTimeout(() => {
      buttonText.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

render();
