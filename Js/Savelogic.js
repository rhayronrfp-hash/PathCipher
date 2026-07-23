window.chavesBlocos = window.chavesBlocos || [];
window.chavesPadraoPorTipo = window.chavesPadraoPorTipo || {};
window.chavePadraoGeral =
  typeof window.chavePadraoGeral === "string" ? window.chavePadraoGeral : "";

function encontrarRegistroChave(id) {
  return window.chavesBlocos.find((registro) => registro.id === id) || null;}

function obterChaveDoBloco(id) {
  const registro = encontrarRegistroChave(id);
  return registro ? registro.chave : "";}

async function salvarChaveDoBloco(id, tipo, chave, escopo = "bloco") {
  const registro = encontrarRegistroChave(id);

  if (registro) {
    registro.chave = chave;
    registro.tipo = tipo;
    registro.escopo = escopo;
  } else {
    window.chavesBlocos.push({
      id,
      tipo,
      chave,
      escopo
    });
  }

  if (window.limparCacheOtimizacao) window.limparCacheOtimizacao();
  if (window.ModoReverseActive && window.regenerarAncoraReversa)
    await window.regenerarAncoraReversa();

  const btnExecutar = document.querySelector(".executar");
  if (btnExecutar) btnExecutar.click();
}

function removerChaveDoBloco(id) {
  window.chavesBlocos = window.chavesBlocos.filter((registro) => registro.id !== id);}

function chavePadraoParaTipo(tipo) {
  if (Object.prototype.hasOwnProperty.call(window.chavesPadraoPorTipo, tipo)) {
    return window.chavesPadraoPorTipo[tipo];
  }
  return window.chavePadraoGeral || "";
}

async function aplicarChaveComEscopo(idOrigem, tipoOrigem, chave, escopo) {
  await salvarChaveDoBloco(idOrigem, tipoOrigem, chave, escopo);

  if (escopo === "tipo") {
    window.chavesPadraoPorTipo[tipoOrigem] = chave;

    for (const bloco of (window.pipeline || [])) {
      if (
        bloco.tipo === tipoOrigem &&
        bloco.tipo !== "rsa" &&
        bloco.tipo !== "rsa_inverso"
      ) {
        await salvarChaveDoBloco(bloco.id, bloco.tipo, chave, escopo);
      }
    }
  } else if (escopo === "geral") {
    window.chavePadraoGeral = chave;

    for (const bloco of (window.pipeline || [])) {
      if (
        window.tiposComChave &&
        window.tiposComChave.includes(bloco.tipo) &&
        bloco.tipo !== "rsa" &&
        bloco.tipo !== "rsa_inverso"
      ) { await salvarChaveDoBloco(bloco.id, bloco.tipo, chave, escopo);
      }}}

  if (window.atualizarBotoesChave) { window.atualizarBotoesChave();}}
    
window.obterChaveDoBloco = obterChaveDoBloco;
window.salvarChaveDoBloco = salvarChaveDoBloco;
window.removerChaveDoBloco = removerChaveDoBloco;
window.chavePadraoParaTipo = chavePadraoParaTipo;
window.aplicarChaveComEscopo = aplicarChaveComEscopo;

const overlay = document.getElementById("salvar-arquivo-overlay");
const modal = document.getElementById("salvar-arquivo-modal");
const fecharBtn = document.getElementById("salvar-arquivo-fechar");
const cancelarBtn = document.getElementById("salvar-arquivo-cancelar");
const confirmarBtn = document.getElementById("salvar-arquivo-confirmar");
const alterarPastaBtn = document.getElementById("salvar-arquivo-alterar-pasta");
const nomeInput = document.getElementById("salvar-arquivo-nome");
const extensaoInput = document.getElementById("salvar-arquivo-extensao");
const extensaoBtn = document.getElementById("extensao-btn");
const extensaoTexto = document.getElementById("extensao-btn-texto");
const extensaoMenu = document.getElementById("extensao-menu");
const caminhoTexto = document.getElementById("salvar-arquivo-caminho-texto");
const resumoTipo = document.getElementById("salvar-arquivo-resumo-tipo");
const resumoCaminho = document.getElementById("salvar-arquivo-resumo-caminho");
const caminhoOverlay = document.getElementById("caminho-overlay");
const caminhoModal = document.getElementById("caminho-modal");
const caminhoInput = document.getElementById("caminho-input");
const caminhoFechar = document.getElementById("caminho-fechar");
const caminhoCancelar = document.getElementById("caminho-cancelar");
const caminhoConfirmar = document.getElementById("caminho-confirmar");

window.salvarArquivoDiretorioHandle = window.salvarArquivoDiretorioHandle || null;

const ROTULOS_TIPO = {
  "caminho-chave-texto": "salvar_arquivo.opcao_caminho_chave_texto_titulo",
  "caminho-chave": "salvar_arquivo.opcao_caminho_chave_titulo",
  "caminho-texto": "salvar_arquivo.opcao_caminho_texto_titulo",
  "chave-texto": "salvar_arquivo.opcao_chave_texto_titulo",
  "caminho": "salvar_arquivo.opcao_caminho_titulo",
  "chave": "salvar_arquivo.opcao_chave_titulo",
  "texto": "salvar_arquivo.opcao_texto_titulo"
};

const ROTULOS_FALLBACK = {
  "caminho-chave-texto": "Caminho, chave e texto",
  "caminho-chave": "Caminho e chave",
  "caminho-texto": "Caminho e texto",
  "chave-texto": "Chave e texto",
  "caminho": "Caminho",
  "chave": "Chave",
  "texto": "Texto"
};

function t(key, fallback) {
  const i18n = window.i18next;
  if (i18n && typeof i18n.t === "function") {
    const translated = i18n.t(key);
    if (translated && translated !== key) return translated;
  }
  return fallback;
}

function atualizarI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const fallback = el.textContent;
    const translated = t(key, fallback);
    if (translated) el.textContent = translated;
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    const fallback = el.title || "";
    const translated = t(key, fallback);
    if (translated) el.title = translated;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const fallback = el.placeholder || "";
    const translated = t(key, fallback);
    if (translated) el.placeholder = translated;
  });

  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    const key = el.dataset.i18nValue;
    const fallback = el.value || "";
    const translated = t(key, fallback);
    if (translated) el.value = translated;
  });
}

function tipoSelecionado() {
  const marcado = document.querySelector('input[name="salvar-arquivo-tipo"]:checked');
  return marcado ? marcado.value : "caminho-chave-texto";}

function copiarSeguro(valor) {
  try {
    return JSON.parse(JSON.stringify(valor));
  } catch (erro) {
    return [];
  }
}

function obterEntradaTexto() {
  const entrada = document.querySelector(".cartao-painel .painel-texto");
  return entrada ? entrada.value : "";
}

function obterSaidaTexto() {
  const saida = document.getElementById("saída");
  return saida ? saida.value : "";
}

function sanitizarNomeArquivo(nome) {
  return String(nome || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "Projeto_PathCipher";
}

function obterChavesDaPipelineAtual(incluirCaminho) {
  const pipelineAtual = window.pipeline || [];
  const chavesNormais = [];
  const chavesRSA = {};
  let indexRsa = 0;

  pipelineAtual.forEach((bloco) => {
    const ehRSA = bloco.tipo === "rsa";
    const usaChave = ehRSA || (window.tiposComChave ? window.tiposComChave.includes(bloco.tipo) : true);

    if (!usaChave) return;

    const chave = window.obterChaveDoBloco ? window.obterChaveDoBloco(bloco.id) : (bloco.chave || "");

    if (ehRSA) {
      const rsaObj = {};
      if (incluirCaminho) rsaObj.id = bloco.id;
      rsaObj.tipo = bloco.tipo;

      try {
        const chaveRSA = chave ? JSON.parse(chave) : {};
        rsaObj.publicKey = chaveRSA.publicKey || "";
        rsaObj.privateKey = chaveRSA.privateKey || "";
      } catch (erro) {
        rsaObj.publicKey = "";
        rsaObj.privateKey = "";
        rsaObj.chave = chave || "";
      }

      const chaveIndex = incluirCaminho ? String(bloco.id) : String(indexRsa++);
      chavesRSA[chaveIndex] = rsaObj;
    } else {
      const normalObj = {};
      if (incluirCaminho) normalObj.id = bloco.id;
      normalObj.tipo = bloco.tipo;
      normalObj.chave = chave;

      chavesNormais.push(normalObj);
    }
  });

  return {
    chavesNormais: chavesNormais,
    chavesRSA: chavesRSA
  };
}

function gerarConteudoArquivo(detalhe) {
  const tipo = detalhe.tipo || "caminho-chave-texto";
  const incluirCaminho = tipo.includes("caminho");
  const incluirChave = tipo.includes("chave");
  const incluirTexto = tipo.includes("texto");

  const base = {
    app: "PathCipher",
    salvoEm: new Date().toISOString(),
    nomeArquivo: detalhe.nomeArquivo || "Projeto_PathCipher",
    extensao: detalhe.extensao || ".path",
    pasta: detalhe.pasta || "",
    tipoSelecionado: tipo,
    reverse: !!window.ModoReverseActive
  };

  if (incluirTexto) {
    base.entrada = obterEntradaTexto();
    base.saida = obterSaidaTexto();
  }

  if (incluirCaminho) {
    base.pipeline = copiarSeguro(window.pipeline || []);
  }

  if (incluirChave) {
    const chavesDaPipeline = obterChavesDaPipelineAtual(incluirCaminho);
    base.chaves = chavesDaPipeline.chavesNormais;
    base.rsa = chavesDaPipeline.chavesRSA;
    base.chavesPadraoPorTipo = copiarSeguro(window.chavesPadraoPorTipo || {});
    base.chavePadraoGeral = window.chavePadraoGeral || "";
  }

  if ((detalhe.extensao || ".path").toLowerCase() === ".txt") {
    const linhas = [
      "PathCipher",
      `Salvo em: ${base.salvoEm}`,
      `Nome: ${base.nomeArquivo}`,
      `Extensão: ${base.extensao}`,
      `Pasta: ${base.pasta || ""}`,
      `Modo reverse: ${base.reverse ? "sim" : "não"}`
    ];

    if (incluirTexto) {
      linhas.push(
        "",
        "Texto de entrada:",
        base.entrada || "",
        "",
        "Texto de saída:",
        base.saida || ""
      );
    }

    if (incluirCaminho) {
      linhas.push(
        "",
        "Pipeline atual:",
        JSON.stringify(base.pipeline, null, 2)
      );
    }

    if (incluirChave) {
      linhas.push(
        "",
        "Chaves normais da pipeline:",
        JSON.stringify(base.chaves, null, 2),
        "",
        "Chaves RSA separadas:",
        JSON.stringify(base.rsa, null, 2)
      );
    }

    return linhas.join("\n");
  }

  return JSON.stringify(base, null, 2);
}

async function escreverArquivoLocal(detalhe) {
  const nomeBase = sanitizarNomeArquivo(detalhe.nomeArquivo || "Projeto_PathCipher");
  const extensao = detalhe.extensao || ".path";
  const nomeCompleto = `${nomeBase}${extensao}`;
  const conteudo = gerarConteudoArquivo(detalhe);

  if (window.salvarArquivoDiretorioHandle && typeof window.salvarArquivoDiretorioHandle.getFileHandle === "function") {
    try {
      if (typeof window.salvarArquivoDiretorioHandle.requestPermission === "function") {
        await window.salvarArquivoDiretorioHandle.requestPermission({ mode: "readwrite" });
      }

      const fileHandle = await window.salvarArquivoDiretorioHandle.getFileHandle(nomeCompleto, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(conteudo);
      await writable.close();
      return { nomeCompleto, local: "diretorio" };
    } catch (erro) {
      console.error("Falha ao escrever na pasta escolhida:", erro);
    }
  }

  if (window.showSaveFilePicker) {
    const tipos = extensao === ".txt"
      ? [{ description: "Texto", accept: { "text/plain": [".txt"] } }]
      : [{ description: "Arquivo PathCipher", accept: { "application/json": [".path", ".json"] } }];

    const fileHandle = await window.showSaveFilePicker({
      suggestedName: nomeCompleto,
      types: tipos,
      excludeAcceptAllOption: false
    });

    const writable = await fileHandle.createWritable();
    await writable.write(conteudo);
    await writable.close();
    return { nomeCompleto, local: "picker" };
  }

  const blob = new Blob([conteudo], {
    type: extensao === ".txt" ? "text/plain;charset=utf-8" : "application/json;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeCompleto;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return { nomeCompleto, local: "download" };
}

function atualizarResumo() {
  const nome = (nomeInput?.value || "").trim() || "?";
  const ext = extensaoInput?.value || ".path";
  const pasta = (caminhoTexto?.textContent || "").replace(/\/+$/, "");
  const tipo = tipoSelecionado();

  if (resumoTipo) {
    resumoTipo.textContent = t(ROTULOS_TIPO[tipo], ROTULOS_FALLBACK[tipo] || tipo);}

  if (resumoCaminho) {
    resumoCaminho.textContent = `${pasta}/${nome}${ext}`;}

  if (confirmarBtn) {
    confirmarBtn.disabled = (nomeInput?.value || "").trim() === "";
  }
}

function atualizarBotaoExtensao(valor) {
  if (!extensaoTexto) return;
  const map = {
    ".path": ".path",
    ".json": ".json",
    ".txt": ".txt"
  };

  extensaoTexto.textContent = map[valor] || valor || ".path";

  if (extensaoMenu) {
    extensaoMenu.querySelectorAll(".extensao-opcao").forEach((btn) => {
      btn.classList.toggle("ativo", btn.dataset.value === (valor || ".path"));
    });}}

function abrirModalSalvarArquivo() {
  if (!overlay || !modal) return;
  overlay.classList.add("ativo");
  modal.classList.add("ativo");
  document.body.style.overflow = "hidden";
  atualizarI18n();
  atualizarResumo();
  nomeInput?.focus();}

function fecharModalSalvarArquivo() {
  if (!overlay || !modal) return;
  overlay.classList.remove("ativo");
  modal.classList.remove("ativo");
  document.body.style.overflow = "";
  if (extensaoMenu) extensaoMenu.classList.remove("ativo");
  fecharModalCaminho();}

async function abrirModalCaminho() {
  if (window.showDirectoryPicker) {
    try {
      const diretorio = await window.showDirectoryPicker({ mode: "readwrite" });
      window.salvarArquivoDiretorioHandle = diretorio;
      if (caminhoTexto) {
        caminhoTexto.textContent = diretorio.name ? `/${diretorio.name}` : "/Pasta selecionada";
      }
      atualizarResumo();
      return;
    } catch (erro) {
      if (erro && erro.name === "AbortError") return;
      console.error("Falha ao escolher pasta:", erro);
    }
  }

  if (!caminhoOverlay || !caminhoModal || !caminhoInput) return;
  caminhoInput.value = caminhoTexto?.textContent || "";
  caminhoOverlay.classList.add("ativo");
  caminhoModal.classList.add("ativo");
  caminhoInput.focus();}

function fecharModalCaminho() {
  if (!caminhoOverlay || !caminhoModal) return;
  caminhoOverlay.classList.remove("ativo");
  caminhoModal.classList.remove("ativo");}

document.querySelectorAll(".salvamento").forEach((botao) => {
  if (botao) botao.addEventListener("click", abrirModalSalvarArquivo);});

if (fecharBtn) fecharBtn.addEventListener("click", fecharModalSalvarArquivo);
if (cancelarBtn) cancelarBtn.addEventListener("click", fecharModalSalvarArquivo);
if (overlay) overlay.addEventListener("click", fecharModalSalvarArquivo);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modal?.classList.contains("ativo")) fecharModalSalvarArquivo();
    if (caminhoModal?.classList.contains("ativo")) fecharModalCaminho();
  }});

document.querySelectorAll('input[name="salvar-arquivo-tipo"]').forEach((input) => {
  input.addEventListener("change", atualizarResumo);
});

if (nomeInput) nomeInput.addEventListener("input", atualizarResumo);
if (extensaoInput) extensaoInput.addEventListener("change", atualizarResumo);

if (extensaoBtn && extensaoMenu) {
  extensaoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    extensaoMenu.classList.toggle("ativo");});

  document.addEventListener("click", () => {
    extensaoMenu.classList.remove("ativo");});

  extensaoMenu.querySelectorAll(".extensao-opcao").forEach((opcao) => {
    opcao.addEventListener("click", () => {
      const valor = opcao.dataset.value || ".path";
      if (extensaoInput) extensaoInput.value = valor;
      atualizarBotaoExtensao(valor);
      extensaoMenu.classList.remove("ativo");
      atualizarResumo();
    });
  });}

if (alterarPastaBtn) {alterarPastaBtn.addEventListener("click", abrirModalCaminho);}
if (caminhoOverlay) caminhoOverlay.addEventListener("click", fecharModalCaminho);
if (caminhoFechar) caminhoFechar.addEventListener("click", fecharModalCaminho);
if (caminhoCancelar) caminhoCancelar.addEventListener("click", fecharModalCaminho);

if (caminhoConfirmar) {
  caminhoConfirmar.addEventListener("click", () => {
    if (caminhoInput && caminhoInput.value.trim() && caminhoTexto) {
      caminhoTexto.textContent = caminhoInput.value.trim();
      atualizarResumo();}
    fecharModalCaminho();});}

if (confirmarBtn) {
  confirmarBtn.addEventListener("click", async () => {
    const detalhe = {
      tipo: tipoSelecionado(),
      nomeArquivo: (nomeInput?.value || "").trim(),
      extensao: extensaoInput?.value || ".path",
      pasta: caminhoTexto?.textContent || "",
    };

    document.dispatchEvent(new CustomEvent("pathcipher:salvar-arquivo", { detail: detalhe }));

    try {
      await escreverArquivoLocal(detalhe);
      fecharModalSalvarArquivo();
    } catch (erro) {
      if (erro && erro.name === "AbortError") return;
      console.error("Erro ao salvar arquivo:", erro);
      alert("Não foi possível salvar o arquivo.");}});}

document.addEventListener("pathcipher:salvar-arquivo", (e) => {
  console.log("pathcipher:salvar-arquivo", e.detail);});

function inicializar() {
  atualizarBotaoExtensao(extensaoInput?.value || ".path");
  atualizarI18n();
  atualizarResumo();}

inicializar();
