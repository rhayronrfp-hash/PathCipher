document.addEventListener("DOMContentLoaded", () => {
  window.pipeline = [];
  window.idCounter = 0;
  window.blocoArrastado = null;

  const mainsideicon = document.querySelector(".principal")
  const sideIcons = document.querySelectorAll(".side-icon");
  const canvasContainer = document.getElementById("fluxo-container");
  const svgNS = "http://www.w3.org/2000/svg";
  const svgLinhas = document.createElementNS(svgNS, "svg");
  svgLinhas.id = "linhas-svg";
  svgLinhas.setAttribute("aria-hidden", "true");
  
  const linhaativada = document.querySelector('.mostrar-linha')
  let linhas = linhaativada ? linhaativada.checked : true;
  
    
  let Salvo = false
  const fundoConfig = document.querySelector(".config-overlay");
  const janelaConfig = document.querySelector(".config-modal");
  const botaodesalvar = document.querySelector(".botao-confirmar-ajustes")
  const fundoCredit = document.querySelector('.credit-overlay')
  const janelaCredit = document.querySelector(".credit-modal")
  const creditIcon = document.querySelector(".credit")
  const btnFecharCreditos = document.querySelector(".fechar-creditos");
  const btnPrincipal = document.querySelector(".side-icon.principal");

function fecharCreditos() {
  fundoCredit.classList.remove("ativo");
  janelaCredit.classList.remove("ativo");
  sideIcons.forEach((icon) => {icon.classList.remove("ativo");});
  btnPrincipal?.classList.add("ativo");}
        
  if (btnFecharCreditos) {btnFecharCreditos.addEventListener("click", fecharCreditos);}
  if (fundoCredit) {fundoCredit.addEventListener("click", fecharCreditos);}
  botaodesalvar.addEventListener("click", async () => {
    Salvo = true;
    if (window.toggleRemoverAviso && window.salvarPreferenciaRemoverAviso) {
    window.salvarPreferenciaRemoverAviso(window.toggleRemoverAviso.checked);}
    
    if (idiomaSelecionado && idiomaSelecionado !== i18next.language) {
    await i18next.changeLanguage(idiomaSelecionado);
    localStorage.setItem(CHAVE_IDIOMA, idiomaSelecionado);
    atualizarIdioma();
    marcarIdiomaSelecionado(idiomaSelecionado);}

    if (linhaativada) {
      linhas = linhaativada.checked;
      if (window.salvarPreferenciaMostrarLinhas) {
        window.salvarPreferenciaMostrarLinhas(linhas);
      }
    }

    const radioTemaSelecionado = document.querySelector('input[name="tema"]:checked');
    if (radioTemaSelecionado && window.salvarPreferenciaTema) {
      window.salvarPreferenciaTema(radioTemaSelecionado.value);
      window.aplicarTema(radioTemaSelecionado.value);
    }

    const radioTamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');
    if (radioTamanhoSelecionado && window.salvarPreferenciaTamanhoBlocos) {
      window.salvarPreferenciaTamanhoBlocos(radioTamanhoSelecionado.value);
      window.aplicarTamanhoBlocos(radioTamanhoSelecionado.value);
    }
    
    const radioDistanciaSelecionado = document.querySelector('input[name="distância"]:checked');
    if (radioDistanciaSelecionado && window.salvarPreferenciaDistanciaBlocos) {
      window.salvarPreferenciaDistanciaBlocos(radioDistanciaSelecionado.value);
      window.aplicarDistanciaBlocos(radioDistanciaSelecionado.value);
    }
    
    if (!linhas) {
      svgLinhas.innerHTML = "";}
      
      renderizarCanvas();
      esconderConfiguracoes();
    });
  
const VERSAO = " 1.0";
function atualizarVersao() {
    const elemento = document.querySelector(".creditos-versao-badge");
    elemento.textContent += VERSAO;
}

  window.historicoPipeline = [];
window.indiceHistorico = -1;

  function esconderConfiguracoes() {
  fundoConfig.classList.remove("ativo");
  janelaConfig.classList.remove("ativo");
  document.body.style.overflow = "";
  Salvo=false
  }
  
  function esconderCredits() {
    fundoCredit.classList.remove("ativo")
    janelaCredit.classList.remove("ativo")
    document.body.style.overflow = "";
  }
  
  function salvarHistorico() {
  window.historicoPipeline = window.historicoPipeline.slice(
    0,
    window.indiceHistorico + 1
  );

  window.historicoPipeline.push(
    JSON.parse(JSON.stringify(window.pipeline))
  );

  window.indiceHistorico = window.historicoPipeline.length - 1;
}  
 
  
  function atualizarResultado() {
    if (!txtEntrada.value.trim()) {
    txtSaida.value = "";
    return;}
    const btnExecutar = document.querySelector(".executar");
    if (btnExecutar) {
      btnExecutar.click();
    }
  }


  document.querySelectorAll(".sidebar-blocos .bloco").forEach((botao) => {
    botao.addEventListener("click", () => adicionarBloco(botao));
  });



  async function removerBloco(id) {
    pipeline = pipeline.filter((b) => b.id !== id);
    salvarHistorico();

    if (window.removerChaveDoBloco) {
      window.removerChaveDoBloco(id);
    }

    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao();
    }

    if (window.regenerarAncoraReversa) {
      await window.regenerarAncoraReversa();
    }

    if (window.atualizarPreviewDescriptografia) {
      window.atualizarPreviewDescriptografia();
    }

    renderizarCanvas();
    atualizarResultado();
    
    if (window.salvarEstado) {
      window.salvarEstado();
    }
  }


  async function reordenar(idOrigem, idDestino) {
    if (idOrigem === idDestino) return;

    const indexOrigem = pipeline.findIndex((b) => b.id === idOrigem);
    const indexDestino = pipeline.findIndex((b) => b.id === idDestino);
        /* 67 67 67 SIX SEVENNNNNN */

    if (indexOrigem === -1 || indexDestino === -1) return;

    const temporario = pipeline[indexOrigem];
    pipeline[indexOrigem] = pipeline[indexDestino];
    pipeline[indexDestino] = temporario;
    salvarHistorico();
    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao();
    }

    if (window.regenerarAncoraReversa) {
      await window.regenerarAncoraReversa();
    }

    renderizarCanvas();
    atualizarResultado();

    if (window.salvarEstado) {
    window.salvarEstado();
    }
  }



  function renderizarCanvas() {
  canvasContainer.innerHTML = "";
  canvasContainer.appendChild(svgLinhas);
  canvasContainer.appendChild(criarNoFixo("início", "fluxo.inicio"));

  pipeline.forEach((bloco) => {
    canvasContainer.appendChild(criarNoBloco(bloco));
  });

  if (pipeline.length > 0) {
    canvasContainer.appendChild(criarNoFixo2("Final", "fluxo.final"));
  }

  canvasContainer
    .querySelectorAll(".flow-block")
    .forEach((el) => (el.style.marginLeft = ""));

  const blocos = [...canvasContainer.querySelectorAll(".flow-block")];

  if (linhas && blocos.length >= 2) {
    const topPrimeiraLinha = blocos[0].offsetTop;
    const alvoX = blocos[1].offsetLeft;
    const containerPadding =
      parseInt(window.getComputedStyle(canvasContainer).paddingLeft) || 0;
    const recuoNecessario = alvoX - containerPadding;

    if (recuoNecessario > 0) {
      let ultimaLinhaProcessada = topPrimeiraLinha;

      for (let i = 1; i < blocos.length; i++) {
        if (blocos[i].offsetTop > ultimaLinhaProcessada + 8) {
          blocos[i].style.marginLeft = `${recuoNecessario}px`;
          ultimaLinhaProcessada = blocos[i].offsetTop;}}}

    const ultimoBloco = blocos[blocos.length - 1];

    if (
      ultimoBloco &&
      ultimoBloco.classList.contains("flow-saida") &&
      blocos.length > 1
    ) {
      const blocoAnterior = blocos[blocos.length - 2];

      if (ultimoBloco.offsetTop > blocoAnterior.offsetTop + 8) {
        ultimoBloco.style.marginLeft = "auto";
      }
    }
  }

  requestAnimationFrame(desenharLinhas);
  atualizarIdioma();
}
  window.renderizarCanvas = renderizarCanvas;


  function criarNoFixo(texto, chaveI18n) {
    const div = document.createElement("div");
    div.className = "flow-block flow-fixo";
    div.textContent = texto;
    if (chaveI18n) div.setAttribute("data-i18n", chaveI18n);
    return div;}


  function criarNoFixo2(texto, chaveI18n) {
    const div = document.createElement("div");
    div.className = "flow-block flow-saida";
    div.textContent = texto;
    if (chaveI18n) div.setAttribute("data-i18n", chaveI18n);
    return div;}


  function criarNoBloco(bloco) {
  const div = document.createElement("div");
  div.className = `flow-block ${bloco.cor}`;
  div.dataset.id = bloco.id;
  const botaoOrigem = document.querySelector(
    `.sidebar-blocos .bloco[data-type="${bloco.tipo}"]`
  );
  const srcIconeOriginal = botaoOrigem?.querySelector("img")?.getAttribute("src") || "";
  const srcIcone = srcIconeOriginal.replace("(1)", ""); 
  const precisaDeChave = window.tiposComChave && window.tiposComChave.includes(bloco.tipo);
  const botaoChaveHtml = precisaDeChave
    ? `<button class="flow-chave-btn" type="button" title="Configurar chave" data-i18n-title="acao.configurar_chave">
        <span class="flow-chave-icone-slot"></span>
        <span class="flow-chave-barras"><i></i><i></i><i></i></span>
      </button>`
    : "";

  div.innerHTML = `
    ${botaoChaveHtml}
    <img class="flow-icon" src="${srcIcone}" alt="${bloco.label}">
    <span class="flow-label">${bloco.label}</span>
    <button class="flow-remove" title="Remover" data-i18n-title="acao.remover">×</button>
  `;

    if (precisaDeChave) {
    configurarBotaoChave(div, bloco, precisaDeChave, temaChavePorCor(bloco.cor));
    
    div.querySelector(".flow-chave-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (bloco.tipo === "rsa" || bloco.tipo === "rsa_inverso") {
        if (window.abrirModalRSA) window.abrirModalRSA(bloco.id);
      } else {
        if (window.abrirModalChave) window.abrirModalChave(bloco.id, bloco.tipo, bloco.label);
      }
    });
  }

  div.querySelector(".flow-remove").addEventListener("click", (e) => {
    e.stopPropagation();
    removerBloco(bloco.id);});
  
  div.addEventListener("dblclick", () => {
    removerBloco(bloco.id);});

  let timerX;

  div.addEventListener("click", (e) => {
    if (e.target.closest(".flow-remove") || e.target.closest(".flow-chave-btn")) return;
    
    document.querySelectorAll(".flow-block.active").forEach((el) => {
      if (el !== div) el.classList.remove("active");});

    div.classList.add("active");
    clearTimeout(timerX);
    timerX = setTimeout(() => {
      div.classList.remove("active");
    }, 3000);});

  habilitarArraste(div, bloco);
  return div;}

  async function adicionarBloco(botaoOrigem) {
    const tipo = botaoOrigem.dataset.type;
    const label = botaoOrigem.textContent.trim();
    const cor =
      [...botaoOrigem.classList].find((c) => c.startsWith("bloco-")) ||
      "bloco-verde";

    const novoBloco = { id: idCounter++, tipo, label, cor };

    if (window.ModoReverseActive) {
      pipeline.unshift(novoBloco);
    } else {
      pipeline.push(novoBloco);
    }

    if (window.tiposComChave && window.tiposComChave.includes(tipo) && window.chavePadraoParaTipo) {
      const chaveInicial = window.chavePadraoParaTipo(tipo);
      if (chaveInicial && window.salvarChaveDoBloco) {
        window.salvarChaveDoBloco(novoBloco.id, tipo, chaveInicial);
      }
    }

    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao();
    }

    if (window.regenerarAncoraReversa) {
      await window.regenerarAncoraReversa();
    }
    
    salvarHistorico();
    renderizarCanvas();
    atualizarResultado();
    
    if (window.salvarEstado) {
    window.salvarEstado();
    }
  }



  function desenharLinhas() {
  svgLinhas.innerHTML = "";

  if (!linhas) {
    return;
  }

  const containerRect = canvasContainer.getBoundingClientRect();
  const blocos = [...canvasContainer.querySelectorAll(".flow-block")];

  if (blocos.length < 2) return;

  const largura = Math.max(canvasContainer.scrollWidth, canvasContainer.clientWidth);
  const altura = Math.max(canvasContainer.scrollHeight, canvasContainer.clientHeight);

  svgLinhas.setAttribute("viewBox", `0 0 ${largura} ${altura}`);
  svgLinhas.setAttribute("width", largura);
  svgLinhas.setAttribute("height", altura);

  const defs = document.createElementNS(svgNS, "defs");
  const marker = document.createElementNS(svgNS, "marker");

  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("markerWidth", "7.3");
  marker.setAttribute("markerHeight", "7.3");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "2.95");
  marker.setAttribute("orient", "auto");
  marker.setAttribute("markerUnits", "strokeWidth");

  const arrowPath = document.createElementNS(svgNS, "path");
  arrowPath.setAttribute("d", "M-1.35,0 L-1.35,6 L6.65,3 z");
  arrowPath.setAttribute("fill", "#656E7B");

  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svgLinhas.appendChild(defs);

  for (let i = 0; i < blocos.length - 1; i++) {
    const a = blocos[i];
    const b = blocos[i + 1];
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();

    const x1 = r1.right - containerRect.left;
    const y1 = r1.top + r1.height / 2 - containerRect.top;
    const x2 = r2.left - containerRect.left;
    const y2 = r2.top + r2.height / 2 - containerRect.top;
    const mesmaLinha = Math.abs(y1 - y2) < 8;

    let d = "";

    if (mesmaLinha) {
      d = `M ${x1} ${y1} L ${x2 - 4} ${y2}`;
    } else {
      const stub = 24;
      const bottomA = r1.bottom - containerRect.top;
      const topB = r2.top - containerRect.top;
      const yGap = (bottomA + topB) / 2;

      d = `M ${x1} ${y1} L ${x1 + stub} ${y1} L ${x1 + stub} ${yGap} L ${x2 - stub} ${yGap} L ${x2 - stub} ${y2} L ${x2} ${y2}`;
    }

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#656E7B");
    path.setAttribute("stroke-width", "2.7");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("marker-end", "url(#arrowhead)");

    svgLinhas.appendChild(path);
  }
}
  
  
  function habilitarArraste(elemento, bloco) {
    elemento.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".flow-remove")) return;

      blocoArrastado = bloco;
      elemento.classList.add("arrastando");
      elemento.setPointerCapture(e.pointerId);
    });

    elemento.addEventListener("pointermove", (e) => {
      if (!blocoArrastado) return;

      document.querySelectorAll(".flow-block.drag-over").forEach((el) => {
        el.classList.remove("drag-over");
      });

      const alvo = document.elementFromPoint(e.clientX, e.clientY);
      const blocoAlvo = alvo?.closest(".flow-block");

      if (
        blocoAlvo &&
        !blocoAlvo.classList.contains("flow-fixo") &&
        !blocoAlvo.classList.contains("flow-saida") &&
        Number(blocoAlvo.dataset.id) !== blocoArrastado.id
      ) {
        blocoAlvo.classList.add("drag-over");
      }
    });

    elemento.addEventListener("pointerup", (e) => {
      if (!blocoArrastado) return;
      const alvo = document.elementFromPoint(e.clientX, e.clientY);
      const blocoAlvo = alvo?.closest(".flow-block");
      document.querySelectorAll(".flow-block").forEach((el) => {
        el.classList.remove("drag-over", "arrastando");
      });

      if (
        blocoAlvo &&
        blocoAlvo.dataset.id &&
        Number(blocoAlvo.dataset.id) !== blocoArrastado.id
      ) {
        reordenar(blocoArrastado.id, Number(blocoAlvo.dataset.id));
      }

      blocoArrastado = null;
    });
  }
  window.addEventListener("load", () => {
    mainsideicon.classList.add("ativo");
    });
   
    
  sideIcons.forEach((icon) => {
  icon.addEventListener("click", () => {

    sideIcons.forEach((item) => {
      item.classList.remove("ativo");
    });
    icon.classList.add("ativo");
  });
  });
  
  creditIcon.addEventListener("click", () => {
    fundoCredit.classList.add("ativo");
    janelaCredit.classList.add("ativo");
  });
  
  
  salvarHistorico();
  renderizarCanvas();
  atualizarBotoesChave();
  
  if (window.salvarEstado) {
  window.salvarEstado();
  }

  const chaveOverlay = document.querySelector(".chave-overlay");
  const chaveModal = document.querySelector(".chave-modal");
  const chaveTituloBloco = document.querySelector(".chave-titulo-bloco");
  const chaveCampoInput = document.querySelector(".chave-campo-input");
  const chaveOlhoBtn = document.querySelector(".chave-olho");
  const chaveFecharBtn = document.querySelector(".chave-fechar");
  const chaveCancelarBtn = document.querySelector(".chave-cancelar");
  const chaveSalvarBtn = document.querySelector(".chave-salvar");
  const chaveOpcaoTituloTipo = document.querySelector(".chave-opcao-titulo-tipo");
  const radiosChaveEscopo = document.querySelectorAll('input[name="chave-escopo"]');

  const NOMES_TIPO_CHAVE = {
    aes: "AES", rsa: "RSA", chacha20: "ChaCha20", cesar: "César",
    vigenere: "Vigenère", md5: "MD5 hmac", sha256: "SHA-256 hmac", sha512: "SHA-512 hmac"
  };

  const TEMAS_CHAVE = {
    "bloco-azul": {
      cor: "#256af9",
      icone: "Assets/Icons/Chave-azul.png"
    },
    "bloco-verde": {
      cor: "#53996F",
      icone: "Assets/Icons/Chave-verde.png"
    },
    "bloco-vermelho": {
      cor: "#F0211C",
      icone: "Assets/Icons/Chave-vermelha.png"
    },
    "bloco-amarelo": {
      cor: "#ffdc22",
      icone: "Assets/Icons/Chave-amarela.png"
    }
  };

  const ICONE_ESCUDO = "Assets/Icons/Escudo.png";
  const ICONE_OLHO_ABERTO = "Assets/Icons/Olho.png";
  const ICONE_OLHO_FECHADO = "Assets/Icons/Olho2.png";

  let blocoChaveAtual = null;

  function nomeExibicaoTipoChave(tipo) {
    return NOMES_TIPO_CHAVE[tipo] || (tipo ? tipo.toUpperCase() : "");
  }

  function temaChavePorCor(cor) {
    return TEMAS_CHAVE[cor] || TEMAS_CHAVE["bloco-azul"];
  }

  function aplicarIconeNoSlot(slot, src) {
    if (!slot) return;
    if (slot.tagName === "IMG") {
      slot.src = src || "";
      slot.alt = "";
    } else {
      slot.style.display = "block";
      slot.style.backgroundImage = src ? `url("${src}")` : "";
      slot.style.backgroundSize = "contain";
      slot.style.backgroundRepeat = "no-repeat";
      slot.style.backgroundPosition = "center";
      slot.style.backgroundColor = "transparent";
      slot.textContent = "";
    }
  }

  function configurarBotaoChave(div, bloco, precisaDeChave, tema) {
  if (!precisaDeChave) return;
  const botao = div.querySelector(".flow-chave-btn");
  const slot = div.querySelector(".flow-chave-icone-slot");
  const barras = div.querySelector(".flow-chave-barras");
  const chaveSalva = window.obterChaveDoBloco ? window.obterChaveDoBloco(bloco.id) : "";
  const temChave = !!(chaveSalva && chaveSalva.trim().length);

  if (botao) {
    botao.title = temChave ? "Chave configurada" : "Configurar chave";
    botao.classList.toggle("configurada", temChave);
    botao.classList.toggle("pendente", !temChave);
  }

  if (slot) {
    if (temChave) {
      aplicarIconeNoSlot(slot, tema.icone);
      slot.style.display = "block";
    } else {
      slot.src = "";
      slot.style.display = "none";
    }
  }

  if (barras) {
    barras.style.display = temChave ? "none" : "flex";
  }
}
  function atualizarBotoesChave() {
  document.querySelectorAll(".flow-block").forEach((div) => {
    const id = Number(div.dataset.id);
    const bloco = (window.pipeline || []).find((item) => item.id === id);
    if (!bloco) return;

    const precisaDeChave = window.tiposComChave && window.tiposComChave.includes(bloco.tipo);
    if (!precisaDeChave) return;

    configurarBotaoChave(div, bloco, true, temaChavePorCor(bloco.cor));
  });
}

  function abrirModalChave(id, tipo, label) {
    if (!chaveModal || !chaveOverlay) return;

    blocoChaveAtual = { id, tipo, label };
    const nomeTipo = nomeExibicaoTipoChave(tipo);
    const blocoAtual = (window.pipeline || []).find((item) => item.id === id);
    const temaAtual = temaChavePorCor(blocoAtual ? blocoAtual.cor : "");
    const chaveAtual = window.obterChaveDoBloco ? window.obterChaveDoBloco(id) : "";
    const chaveOlhoIcone = chaveOlhoBtn ? chaveOlhoBtn.querySelector(".chave-olho-icone-slot") : null;
    const chaveAvisoIcone = chaveModal ? chaveModal.querySelector(".chave-aviso-icone-slot") : null;
    const chaveTopoIcone = chaveModal ? chaveModal.querySelector(".chave-icone-bloco") : null;

    if (chaveModal) {
      chaveModal.style.setProperty("--chave-cor", temaAtual.cor);
    }

    if (chaveTopoIcone) {
      aplicarIconeNoSlot(chaveTopoIcone, temaAtual.icone);
  
    }

    if (chaveOlhoIcone) {
      aplicarIconeNoSlot(chaveOlhoIcone, ICONE_OLHO_FECHADO);}
    
    if (chaveAvisoIcone) {
      aplicarIconeNoSlot(chaveAvisoIcone, ICONE_ESCUDO);
    }

    if (chaveTituloBloco) chaveTituloBloco.textContent = nomeTipo;
    if (chaveTituloBloco)  {chaveOpcaoTituloTipo.textContent = i18next.t("chave.todos_tipo_titulo", {
        tipo: nomeTipo});}
    if (chaveCampoInput) {
      chaveCampoInput.value = chaveAtual;
      chaveCampoInput.type = "password";
    }

    radiosChaveEscopo.forEach((radio) => {
      radio.checked = radio.value === "bloco";
    });

    chaveOverlay.classList.add("ativo");
    chaveModal.classList.add("ativo");
    document.body.style.overflow = "hidden";
  }
  window.abrirModalChave = abrirModalChave;

  function fecharModalChave() {
    if (!chaveModal || !chaveOverlay) return;
    chaveOverlay.classList.remove("ativo");
    chaveModal.classList.remove("ativo");
    document.body.style.overflow = "";
    blocoChaveAtual = null;
  }

  if (chaveFecharBtn) chaveFecharBtn.addEventListener("click", fecharModalChave);
  if (chaveCancelarBtn) chaveCancelarBtn.addEventListener("click", fecharModalChave);
  if (chaveOverlay) chaveOverlay.addEventListener("click", fecharModalChave);

  if (chaveOlhoBtn && chaveCampoInput) {
    chaveOlhoBtn.addEventListener("click", () => {
      const chaveOlhoIcone = chaveOlhoBtn.querySelector(".chave-olho-icone-slot");
      const oculto = chaveCampoInput.type === "password";
      chaveCampoInput.type = oculto ? "text" : "password";
      if (chaveOlhoIcone) {
        aplicarIconeNoSlot(chaveOlhoIcone, oculto ? ICONE_OLHO_ABERTO : ICONE_OLHO_FECHADO);
      }
    });
  }

  if (chaveSalvarBtn) {
    chaveSalvarBtn.addEventListener("click", async () => {
      if (!blocoChaveAtual) return;

      const escopoSelecionado = document.querySelector('input[name="chave-escopo"]:checked');
      const escopo = escopoSelecionado ? escopoSelecionado.value : "bloco";
      const chave = chaveCampoInput ? chaveCampoInput.value : "";

      if (window.aplicarChaveComEscopo) {
        window.aplicarChaveComEscopo(blocoChaveAtual.id, blocoChaveAtual.tipo, chave, escopo);
      }

      const blocoEl = document.querySelector(`.flow-block[data-id="${blocoChaveAtual.id}"]`);
      if (blocoEl) {
        const blocoData = (window.pipeline || []).find(b => b.id === blocoChaveAtual.id);
        if (blocoData) configurarBotaoChave(blocoEl, blocoData, true, temaChavePorCor(blocoData.cor));
      }

      if (window.limparCacheOtimizacao) window.limparCacheOtimizacao();
      if (window.regenerarAncoraReversa) {
        await window.regenerarAncoraReversa();
      }

atualizarResultado();

      if (window.salvarEstado) window.salvarEstado();

      fecharModalChave();
    });
  }
  
  const rsaOverlay = document.querySelector(".rsa-overlay");
  const rsaModal = document.querySelector(".rsa-modal");
  const rsaFecharBtn = document.querySelector(".rsa-fechar");
  const rsaCancelarBtn = document.querySelector(".rsa-cancelar");
  const rsaSalvarBtn = document.querySelector(".rsa-salvar");
  
  const rsaGerarBtn = document.getElementById("rsa-gerar-btn");
  const rsaCopiarPubBtn = document.getElementById("rsa-copiar-pub-btn");
  const rsaCopiarPrivBtn = document.getElementById("rsa-copiar-priv-btn");
  const rsaImportarPrivBtn = document.getElementById("rsa-importar-priv-btn");

  const rsaPubTextArea = document.getElementById("rsa-public-key");
  const rsaPrivTextArea = document.getElementById("rsa-private-key");

  let blocoRsaAtualId = null;

  window.abrirModalRSA = function(id) {
    blocoRsaAtualId = id;
    const chaveSalva = window.obterChaveDoBloco ? window.obterChaveDoBloco(id) : "";
    
    let pub = "";
    let priv = "";
    try {
      if (chaveSalva) {
        const obj = JSON.parse(chaveSalva);
        pub = obj.publicKey || "";
        priv = obj.privateKey || "";
      }
    } catch(e) {
      pub = chaveSalva;
    }

    rsaPubTextArea.value = pub;
    rsaPrivTextArea.value = priv;

    rsaOverlay.classList.add("ativo");
    rsaModal.classList.add("ativo");
    document.body.style.overflow = "hidden";
  };

  function fecharModalRSA() {
    rsaOverlay.classList.remove("ativo");
    rsaModal.classList.remove("ativo");
    document.body.style.overflow = "";
    blocoRsaAtualId = null;
  }

  rsaFecharBtn.addEventListener("click", fecharModalRSA);
  rsaCancelarBtn.addEventListener("click", fecharModalRSA);
  rsaOverlay.addEventListener("click", fecharModalRSA);

  rsaGerarBtn.addEventListener("click", async () => {
    rsaGerarBtn.disabled = true;
    rsaGerarBtn.textContent = "Gerando...";
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,
        ["encrypt", "decrypt"]
      );

      const pubExported = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const pubB64 = btoa(String.fromCharCode(...new Uint8Array(pubExported)));
      const pubPem = `-----BEGIN PUBLIC KEY-----\n${pubB64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`;

      const privExported = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      const privB64 = btoa(String.fromCharCode(...new Uint8Array(privExported)));
      const privPem = `-----BEGIN PRIVATE KEY-----\n${privB64.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----`;

      rsaPubTextArea.value = pubPem;
      rsaPrivTextArea.value = privPem;
    } catch (e) {
      console.error(e);
      alert("Falha ao gerar chaves RSA.");
    } finally {
      rsaGerarBtn.disabled = false;
      rsaGerarBtn.textContent = "Gerar par de chaves";
    }
  });

  rsaCopiarPubBtn.addEventListener("click", () => {
  if (rsaPubTextArea.value) { 
    navigator.clipboard.writeText(rsaPubTextArea.value); 
  }});


  rsaCopiarPrivBtn.addEventListener("click", () => {
  if (rsaPrivTextArea.value) { 
    navigator.clipboard.writeText(rsaPrivTextArea.value); 
  }});

  const rsaImportDialog = document.getElementById("rsa-import-dialog");
  const rsaImportTextarea = document.getElementById("rsa-import-textarea");
  const rsaImportErro = document.getElementById("rsa-import-erro");
  const rsaImportFecharBtn = document.getElementById("rsa-import-fechar");
  const rsaImportCancelarBtn = document.getElementById("rsa-import-cancelar");
  const rsaImportConfirmarBtn = document.getElementById("rsa-import-confirmar");

  function mostrarErroImportacaoRSA(mensagem) {
    if (!rsaImportErro) return;
    rsaImportErro.textContent = mensagem;
    rsaImportErro.hidden = false;
  }

  function limparErroImportacaoRSA() {
    if (!rsaImportErro) return;
    rsaImportErro.textContent = "";
    rsaImportErro.hidden = true;
  }

  function fecharModalImportacaoRSA() {
    if (!rsaImportDialog || !rsaImportDialog.open) return;
    rsaImportDialog.close();
    rsaImportTextarea.value = "";
    limparErroImportacaoRSA();
  }

  rsaImportarPrivBtn.addEventListener("click", () => {
    if (!rsaImportDialog) return;
    limparErroImportacaoRSA();
    rsaImportTextarea.value = "";
    rsaImportDialog.showModal();
    rsaImportTextarea.focus();
  });

  if (rsaImportFecharBtn) rsaImportFecharBtn.addEventListener("click", fecharModalImportacaoRSA);
  if (rsaImportCancelarBtn) rsaImportCancelarBtn.addEventListener("click", fecharModalImportacaoRSA);

  if (rsaImportDialog) {
    rsaImportDialog.addEventListener("click", (evento) => {
      if (evento.target === rsaImportDialog) fecharModalImportacaoRSA();
    });
    
    rsaImportDialog.addEventListener("cancel", () => {
      rsaImportTextarea.value = "";
      limparErroImportacaoRSA();
    });
  }

  if (rsaImportConfirmarBtn) {
    rsaImportConfirmarBtn.addEventListener("click", async () => {
      limparErroImportacaoRSA();

      if (!window.rsaImportarChavePrivada) {
        mostrarErroImportacaoRSA("Módulo de criptografia indisponível.");
        return;
      }

      rsaImportConfirmarBtn.disabled = true;
      rsaImportConfirmarBtn.textContent = "Importando...";

      try {
        const { privateKeyPem, publicKeyPem } = await window.rsaImportarChavePrivada(rsaImportTextarea.value);
        rsaPrivTextArea.value = privateKeyPem;
        rsaPubTextArea.value = publicKeyPem;

        fecharModalImportacaoRSA();
      } catch (err) {
        console.error("Erro na importação da chave privada RSA:", err);
        mostrarErroImportacaoRSA(err && err.message ? err.message : "Falha ao importar a chave privada.");
      } finally {
        rsaImportConfirmarBtn.disabled = false;
        rsaImportConfirmarBtn.textContent = "Confirmar";
      }
    });
  }

  rsaSalvarBtn.addEventListener("click", () => {
    if (blocoRsaAtualId === null) return;

    const chavesStr = JSON.stringify({
      publicKey: rsaPubTextArea.value.trim(),
      privateKey: rsaPrivTextArea.value.trim()
    });

    if (window.salvarChaveDoBloco) window.salvarChaveDoBloco(blocoRsaAtualId, "rsa", chavesStr);

    const blocoEl = document.querySelector(`.flow-block[data-id="${blocoRsaAtualId}"]`);
    if (blocoEl) {
      const slot = blocoEl.querySelector(".flow-chave-icone-slot");
      const barras = blocoEl.querySelector(".flow-chave-barras");
      if (slot) {
        slot.style.display = "block";
        slot.style.width = "10px";
        slot.style.height = "10px";
        slot.style.backgroundImage = `url("Assets/Icons/Chave-azul.png")`;
        slot.style.backgroundSize = "contain";
        slot.style.backgroundRepeat = "no-repeat";}
      
      if (barras) barras.style.display = "none";}
    if (window.limparCacheOtimizacao) window.limparCacheOtimizacao();
    fecharModalRSA();
  });});
  