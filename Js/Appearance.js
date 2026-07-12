document.addEventListener("DOMContentLoaded", () => {
  window.pipeline = [];
  window.idCounter = 0;
  window.blocoArrastado = null;

  const sideIcons = document.querySelectorAll(".side-icon");
  const canvasContainer = document.getElementById("fluxo-container");
  const svgNS = "http://www.w3.org/2000/svg";
  const svgLinhas = document.createElementNS(svgNS, "svg");
  svgLinhas.id = "linhas-svg";
  svgLinhas.setAttribute("aria-hidden", "true");
  
  let linhas = true
  const linhaativada = document.querySelector('.mostrar-linha')
  linhaativada.addEventListener("change", () => {
    linhas = linhaativada.checked;});
  
    
  let Salvo = false
  const fundoConfig = document.querySelector(".config-overlay");
  const janelaConfig = document.querySelector(".config-modal");
  const botaodesalvar = document.querySelector(".botao-confirmar-ajustes")


  
  botaodesalvar.addEventListener("click", async () => {
    Salvo = true;
    if (window.toggleRemoverAviso && window.salvarPreferenciaRemoverAviso) {
    window.salvarPreferenciaRemoverAviso(window.toggleRemoverAviso.checked);}
    
    if (idiomaSelecionado && idiomaSelecionado !== i18next.language) {
    await i18next.changeLanguage(idiomaSelecionado);
    localStorage.setItem(CHAVE_IDIOMA, idiomaSelecionado);
    atualizarIdioma();
    marcarIdiomaSelecionado(idiomaSelecionado);}
    
    if (!linhas) {
      svgLinhas.innerHTML = "";}
      
      renderizarCanvas();
      esconderConfiguracoes();
    });
  
  
  window.historicoPipeline = [];
window.indiceHistorico = -1;

  function esconderConfiguracoes() {
  fundoConfig.classList.remove("ativo");
  janelaConfig.classList.remove("ativo");
  document.body.style.overflow = "";
  Salvo=false
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
    const btnExecutar = document.querySelector(".executar");
    if (btnExecutar) {
      btnExecutar.click();
    }
  }

  document.querySelectorAll(".sidebar-blocos .bloco").forEach((botao) => {
    botao.addEventListener("click", () => adicionarBloco(botao));
  });

  function removerBloco(id) {
    pipeline = pipeline.filter((b) => b.id !== id);
    salvarHistorico();

    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao();
    }

    renderizarCanvas();
    atualizarResultado();
    
    if (window.salvarEstado) {
      window.salvarEstado();
    }
  }

  function reordenar(idOrigem, idDestino) {
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
          ultimaLinhaProcessada = blocos[i].offsetTop;
        }
      }
    }

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
}
  window.renderizarCanvas = renderizarCanvas;

  function criarNoFixo(texto, chaveI18n) {
    const div = document.createElement("div");
    div.className = "flow-block flow-fixo";
    div.textContent = texto;
    if (chaveI18n) div.setAttribute("data-i18n", chaveI18n);
    return div;
  }

  function criarNoFixo2(texto, chaveI18n) {
    const div = document.createElement("div");
    div.className = "flow-block flow-saida";
    div.textContent = texto;
    if (chaveI18n) div.setAttribute("data-i18n", chaveI18n);
    return div;
  }

  function criarNoBloco(bloco) {
  const div = document.createElement("div");
  div.className = `flow-block ${bloco.cor}`;
  div.dataset.id = bloco.id;
  const botaoOrigem = document.querySelector(
    `.sidebar-blocos .bloco[data-type="${bloco.tipo}"]`
  );
  const srcIconeOriginal = botaoOrigem?.querySelector("img")?.getAttribute("src") || "";
  const srcIcone = srcIconeOriginal.replace("(1)", ""); // tira o (1)

  div.innerHTML = `
    <img class="flow-icon" src="${srcIcone}" alt="${bloco.label}">
    <span class="flow-label">${bloco.label}</span>
    <button class="flow-remove" title="Remover" data-i18n-title="acao.remover">×</button>
  `;

  div.querySelector(".flow-remove").addEventListener("click", (e) => {
    e.stopPropagation();
    removerBloco(bloco.id);
  });
  div.addEventListener("dblclick", () => {
    removerBloco(bloco.id);
  });

  let timerX;

  div.addEventListener("click", (e) => {
    if (e.target.closest(".flow-remove")) return;
    
    document.querySelectorAll(".flow-block.active").forEach((el) => {
      if (el !== div) el.classList.remove("active");
    });

    div.classList.add("active");
    clearTimeout(timerX);
    timerX = setTimeout(() => {
      div.classList.remove("active");
    }, 3000);
  });

  habilitarArraste(div, bloco);
  return div;
}

  function adicionarBloco(botaoOrigem) {
    const tipo = botaoOrigem.dataset.type;
    const label = botaoOrigem.textContent.trim();
    const cor =
      [...botaoOrigem.classList].find((c) => c.startsWith("bloco-")) ||
      "bloco-verde";

    const novoBloco = { id: idCounter++, tipo, label, cor };

    if (window.ModoReverseActive) {
      pipeline.unshift(novoBloco);

      const txtEntradaEl = document.querySelector(".cartao-painel .painel-texto");
      if (
        txtEntradaEl &&
        txtEntradaEl.value.trim() !== "" &&
        window.transformacoes &&
        window.transformacoes[tipo]
      ) {
        txtEntradaEl.value = window.transformacoes[tipo](txtEntradaEl.value);
      }
    } else {
      pipeline.push(novoBloco);
    }

    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao();
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
  
  sideIcons.forEach((icon) => {
  icon.addEventListener("click", () => {

    sideIcons.forEach((item) => {
      item.classList.remove("ativo");
    });

    icon.classList.add("ativo");

  });
  });
  salvarHistorico();
  renderizarCanvas();
  
  if (window.salvarEstado) {
  window.salvarEstado();
  }
});