const updates = [
  {
    version: "v2026.02.25",
    date: "25/02/2026",
    title: "Migracao de TTS para Gemini nativo",
    summary: "A leitura em voz alta agora usa Gemini TTS nativo, removendo dependencia do endpoint legado.",
    items: [
      "Fluxo de audio unificado com a mesma GEMINI_API_KEY.",
      "Fallback de modelo de voz para maior estabilidade.",
      "Melhor tratamento de erros no retorno de audio."
    ]
  },
  {
    version: "v2026.02.24",
    date: "24/02/2026",
    title: "Empacotamento .exe revisado",
    summary: "Distribuicao Windows simplificada para usuario final executar apenas o Ratio.exe.",
    items: [
      "Launcher desktop com backend + frontend acoplados.",
      "Ajustes de caminhos em modo executavel.",
      "README atualizado para fluxo de distribuicao."
    ]
  },
  {
    version: "v2026.02.23",
    date: "23/02/2026",
    title: "Resposta final com conclusao em sintese",
    summary: "Prompt de geracao ajustado para incluir conclusao objetiva ao final da resposta.",
    items: [
      "Fechamento da resposta em linguagem direta.",
      "Padrao de citacao mantido para afirmacoes centrais."
    ]
  }
];

const bugfixes = [
  {
    id: "BUG-241",
    date: "25/02/2026",
    title: "Citacoes renderizadas indevidamente como bloco de quote",
    summary: "Trechos nao literais nao sao mais destacados como citacao.",
    items: [
      "Quote visual apenas para texto literalmente citado e entre aspas.",
      "Paragrafos analiticos voltam ao fluxo normal."
    ]
  },
  {
    id: "BUG-237",
    date: "24/02/2026",
    title: "Travamento prolongado em 'Validando chave Gemini...'",
    summary: "Onboarding passou a mostrar feedback de tempo real durante validacao de chave.",
    items: [
      "Mensagens progressivas para latencia normal e latencia alta.",
      "Orientacao de conectividade quando API nao responde."
    ]
  },
  {
    id: "BUG-233",
    date: "24/02/2026",
    title: "Falha de import no executavel: 'No module named backend'",
    summary: "Inicializacao do backend no launcher passou de import por string para import direto do app ASGI.",
    items: [
      "Coleta de modulos no PyInstaller ficou estavel.",
      "Removida regressao de startup em algumas maquinas."
    ]
  }
];

const downloads = [
  {
    channel: "Estavel",
    platform: "Windows x64",
    version: "v2026.02.25",
    packageSize: "aprox. 13.7 GB (com base local)",
    notes: "Pacote completo com executavel, frontend interno e estrutura para lancedb_store.",
    primaryUrl: "https://github.com/carlosvictorodrigues",
    secondaryUrl: "https://ratiojuris.me"
  },
  {
    channel: "Documentacao",
    platform: "Guia de uso",
    version: "Atual",
    packageSize: "online",
    notes: "Passo a passo de instalacao, configuracao de chave e operacao basica.",
    primaryUrl: "https://github.com/carlosvictorodrigues",
    secondaryUrl: "https://ratiojuris.me"
  }
];

const tutorialHighlights = [
  {
    id: "GUIA-01",
    date: "25/02/2026",
    title: "Visao geral e principio anti-alucinacao",
    summary: "O Ratio responde com base em acervo juridico local, com foco em reduzir respostas inventadas.",
    items: [
      "Fluxo de consulta com recuperacao de documentos da base local antes da geracao.",
      "Quando nao encontra base suficiente, o sistema deve sinalizar limite da evidencia."
    ],
    quote:
      "\"A Regra de Ouro: Nao invente. Diga que nao encontrou se a resposta nao constar nos documentos resgatados.\""
  },
  {
    id: "GUIA-02",
    date: "25/02/2026",
    title: "Fluxo RAG em quatro etapas",
    summary: "Cada pergunta passa por embeddings, busca hibrida, rerank e geracao com citacoes.",
    items: [
      "Embeddings para assinatura semantica da pergunta.",
      "Busca vetorial + lexical no acervo.",
      "Rerank para priorizar precedentes mais aderentes.",
      "Resposta final com referencia documental."
    ]
  },
  {
    id: "GUIA-03",
    date: "25/02/2026",
    title: "Forca normativa A-E e filtros",
    summary: "A plataforma classifica fontes por peso juridico e permite ligar/desligar recortes por tribunal e tipo.",
    items: [
      "Nivel A: vinculante forte; Nivel B: precedentes qualificados; Nivel C: sumulas.",
      "Niveis D e E funcionam como apoio orientativo e editorial.",
      "Filtros de STF/STJ e tipos documentais refinam a consulta."
    ]
  }
];

const faq = [
  {
    id: "FAQ-API",
    date: "25/02/2026",
    title: "Chave Gemini valida, mas onboarding demora",
    summary: "A validacao pode sofrer latencia de rede/API. A chave agora pode ser salva mesmo com validacao pendente.",
    items: [
      "Verifique conectividade com Google AI Studio.",
      "Repita a validacao depois, sem bloquear o uso inicial."
    ]
  },
  {
    id: "FAQ-DB",
    date: "25/02/2026",
    title: "Executavel abre, mas consulta falha",
    summary: "Confirme se `lancedb_store` esta na mesma pasta do `Ratio.exe`.",
    items: [
      "Pacote oficial atual ja inclui a base no `dist\\Ratio`.",
      "Se mover o `.exe` sozinho, o app perde acesso ao banco."
    ]
  },
  {
    id: "FAQ-AUDIO",
    date: "25/02/2026",
    title: "Audio nao toca em alguns cenarios",
    summary: "A sintese usa Gemini TTS nativo e depende da mesma chave Gemini da busca.",
    items: [
      "Confirme chave ativa e saldo/cota no projeto Gemini.",
      "Teste uma consulta curta antes de audios longos."
    ]
  }
];

function createEntryCard(entry, badgeLabel, options = {}) {
  const card = document.createElement("article");
  card.className = "entry-card";

  const top = document.createElement("div");
  top.className = "entry-top";

  const title = document.createElement("h3");
  title.className = "entry-title";
  title.textContent = `${entry.version || entry.id} - ${entry.title}`;

  const date = document.createElement("span");
  date.className = "entry-date";
  date.textContent = entry.date || "-";

  top.appendChild(title);
  top.appendChild(date);
  card.appendChild(top);

  const body = document.createElement("p");
  body.className = "entry-body";
  body.textContent = entry.summary;
  card.appendChild(body);

  if (Array.isArray(entry.items) && entry.items.length) {
    const list = document.createElement("ul");
    list.className = "entry-list";
    entry.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = badgeLabel;
  card.appendChild(badge);

  const quote = String(options.quote || entry.quote || "").trim();
  if (quote) {
    const quoteEl = document.createElement("p");
    quoteEl.className = "entry-quote";
    quoteEl.textContent = quote;
    card.appendChild(quoteEl);
  }

  return card;
}

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
  primary.textContent = "Baixar agora";

  const secondary = document.createElement("a");
  secondary.className = "download-link";
  secondary.href = item.secondaryUrl;
  secondary.target = "_blank";
  secondary.rel = "noopener noreferrer";
  secondary.textContent = "Pagina oficial";

  actions.appendChild(primary);
  actions.appendChild(secondary);
  card.appendChild(actions);

  return card;
}

function render() {
  const updatesList = document.getElementById("updatesList");
  const bugsList = document.getElementById("bugsList");
  const downloadsList = document.getElementById("downloadsList");
  const tutorialList = document.getElementById("tutorialList");
  const faqList = document.getElementById("faqList");
  if (!updatesList || !bugsList || !downloadsList || !tutorialList || !faqList) return;

  updates.forEach((entry) => updatesList.appendChild(createEntryCard(entry, "release")));
  bugfixes.forEach((entry) => bugsList.appendChild(createEntryCard(entry, "bugfix")));
  tutorialHighlights.forEach((entry) => tutorialList.appendChild(createEntryCard(entry, "tutorial", { quote: entry.quote })));
  faq.forEach((entry) => faqList.appendChild(createEntryCard(entry, "faq")));
  downloads.forEach((entry) => downloadsList.appendChild(createDownloadCard(entry)));
}

render();
