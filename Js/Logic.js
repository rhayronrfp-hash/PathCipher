window.transformacoes = transformacoesCrypto;

window.pipelinePossuiBlocoSemChave = function pipelinePossuiBlocoSemChave() {
  const pipelineAtual = window.pipeline || [];
  const tiposComChave = window.tiposComChave || [];

  return pipelineAtual.some((bloco) => {
    if (!tiposComChave.includes(bloco.tipo)) return false;

    const chave = window.obterChaveDoBloco
      ? window.obterChaveDoBloco(bloco.id)
      : bloco.chave;

    return !chave || String(chave).trim() === "";
  });
};

let ultimoTextoEntrada = "";
let ultimoCaminhoTipos = [];
let historicoResultadosParciais = [];
let historicoEstados = [];
let indiceEstado = -1;

window.limparCacheOtimizacao = () => {
  ultimoTextoEntrada = "";
  ultimoCaminhoTipos = [];
  historicoResultadosParciais = [];
};
window.ModoReverseActive = false;
window.ancoraDescriptografia = "";

const botaoCopiar = document.querySelector(".cartao-painel:nth-child(2) .painel-copy");
const btnExecutar = document.querySelector(".executar");
const txtEntrada = document.querySelector(".cartao-painel .painel-texto");
const txtSaida = document.getElementById("saída");
const btnInverter = document.querySelector(".inverter");
const botoesSeta = document.querySelectorAll(".setas");
const btnVoltar = botoesSeta[0] || null;
const btnAvancar = botoesSeta[1] || null;
const canvas = document.getElementById("fluxo-container");




txtEntrada.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        btnExecutar.click();}});
        
const tituloEntrada = document.querySelector(
  ".cartao-painel:nth-child(1) .top-painel span"
);
const tituloResultado = document.querySelector(
  ".cartao-painel:nth-child(2) .top-painel span"
);

async function aplicarTransformacaoUnica(tipo, texto, chave) {
  const operacaoInversa = `${tipo}_inverso`;

  if (transformacoes[operacaoInversa]) {
    return await transformacoes[operacaoInversa](texto, chave);
  } else if (transformacoes[tipo]) {
    return await transformacoes[tipo](texto, chave);
  }

  return `[${tipo.toUpperCase()}] ${texto}`;
}

async function atualizarPreviewDescriptografia() {
  if (!window.ModoReverseActive || !txtEntrada) return;

  const pipelineAtual = window.pipeline || [];

  if (pipelineAtual.length === 0) {
    txtEntrada.value = window.ancoraDescriptografia || "";
    return;
  }

  const blocoMaisRecente = pipelineAtual[0];
  const chaveDoBloco = window.obterChaveDoBloco ? window.obterChaveDoBloco(blocoMaisRecente.id) : "";
  txtEntrada.value = await aplicarTransformacaoUnica(
    blocoMaisRecente.tipo,
    window.ancoraDescriptografia || "",
    chaveDoBloco
  );
}
window.atualizarPreviewDescriptografia = atualizarPreviewDescriptografia;

if (txtEntrada) {
  txtEntrada.addEventListener("input", () => {
    if (window.ModoReverseActive) {
      window.ancoraDescriptografia = txtEntrada.value;
    }
  });}

if (botaoCopiar) {
  botaoCopiar.addEventListener("click", () => {
    const valor = document.getElementById("saída").value;

    if (valor.trim()) {
      navigator.clipboard
        .writeText(valor)
        .catch((err) => console.error("não deu certolol", err));
    }
  });}

function textoDoBotaoInverter() {
  return btnInverter ? btnInverter.querySelector("span") : null;
}

const TEXTOS_MODO = {
  normal: {
    entrada: { chave: "termo.criptografar", texto: "Criptografar" },
    resultado: { chave: "termo.criptografia", texto: "Criptografia" },
    botao: { chave: "termo.descriptografia", texto: "Descriptografia" },
  },
  reverso: {
    entrada: { chave: "termo.descriptografar", texto: "Descriptografar" },
    resultado: { chave: "termo.descriptografia", texto: "Descriptografia" },
    botao: { chave: "termo.criptografar", texto: "Criptografar" },
  },
};

function aplicarTextoI18n(elemento, definicao) {
  if (!elemento || !definicao) return;
  elemento.textContent = definicao.texto;
  elemento.setAttribute("data-i18n", definicao.chave);
}

function aplicarTextosModo(reverse) {
  if (btnInverter) {
    btnInverter.classList.toggle("inverter-ativo", !!reverse);
  }
  const modo = reverse ? TEXTOS_MODO.reverso : TEXTOS_MODO.normal;

  aplicarTextoI18n(tituloEntrada, modo.entrada);
  aplicarTextoI18n(tituloResultado, modo.resultado);

  const textoBotao = textoDoBotaoInverter();
  aplicarTextoI18n(textoBotao || btnInverter, modo.botao);

}

function copiarPipeline() {
  return JSON.parse(JSON.stringify(window.pipeline || []));
}

function salvarEstado() {
  if (!txtEntrada || !txtSaida) return;

  const textoBotao = textoDoBotaoInverter();

  const estado = {
    pipeline: copiarPipeline(),
    entrada: txtEntrada.value,
    saida: txtSaida.value,
    reverse: window.ModoReverseActive,
    ancora: window.ancoraDescriptografia,
    tituloEntrada: tituloEntrada ? tituloEntrada.textContent : "",
    tituloResultado: tituloResultado ? tituloResultado.textContent : "",
    botaoInverter: textoBotao ? textoBotao.textContent : (btnInverter ? btnInverter.textContent : "")};

  historicoEstados = historicoEstados.slice(0, indiceEstado + 1);
  historicoEstados.push(estado);
  indiceEstado = historicoEstados.length - 1;}
window.salvarEstado = salvarEstado;

function aplicarEstado(estado) {
  if (!estado) return;

  window.pipeline = JSON.parse(JSON.stringify(estado.pipeline || []));
  window.ModoReverseActive = !!estado.reverse;
  window.ancoraDescriptografia = estado.ancora ?? "";

  if (txtEntrada) txtEntrada.value = estado.entrada ?? "";
  if (txtSaida) txtSaida.value = estado.saida ?? "";

  aplicarTextosModo(window.ModoReverseActive);

  if (typeof window.renderizarCanvas === "function") {
    window.renderizarCanvas();
  }

  if (window.limparCacheOtimizacao) {
    window.limparCacheOtimizacao();
  }
}

function voltarEstado() {
  if (indiceEstado <= 0) return;
  indiceEstado--;
  aplicarEstado(historicoEstados[indiceEstado]);}
  
function avancarEstado() {
  if (indiceEstado >= historicoEstados.length - 1) return;
  indiceEstado++;
  aplicarEstado(historicoEstados[indiceEstado]);}

if (btnVoltar) {
  btnVoltar.addEventListener("click", voltarEstado); }

if (btnAvancar) {
  btnAvancar.addEventListener("click", avancarEstado);}

if (btnExecutar && txtEntrada && txtSaida) {
  btnExecutar.addEventListener("click", async () => {
    const textoOriginal =
      window.ModoReverseActive && typeof window.ancoraDescriptografia === "string"
        ? window.ancoraDescriptografia
        : txtEntrada.value;
    const pipelineAtual = window.pipeline || [];
    const caminhoAtualTipos = pipelineAtual.map((bloco) => bloco.tipo);

    if (caminhoAtualTipos.length === 0) {
      txtSaida.value = textoOriginal;
      ultimoTextoEntrada = textoOriginal;
      ultimoCaminhoTipos = [];
      historicoResultadosParciais = [];

      salvarEstado();
      return;
    }

    let textoProcessado = textoOriginal;
    let indexInicio = 0;

    if (textoOriginal === ultimoTextoEntrada && ultimoCaminhoTipos.length > 0) {
      let correspondencias = 0;

      for (let i = 0; i < caminhoAtualTipos.length; i++) {
        if (caminhoAtualTipos[i] === ultimoCaminhoTipos[i]) {
          correspondencias++;
        } else {
          break;
        }}
      if (correspondencias > 0) {
        indexInicio = correspondencias;
        textoProcessado = historicoResultadosParciais[correspondencias - 1];
      }
    }

    if (indexInicio === 0) {
      historicoResultadosParciais = [];
    } else {
      historicoResultadosParciais = historicoResultadosParciais.slice(0, indexInicio);
    }

    for (let i = indexInicio; i < pipelineAtual.length; i++) {
      const bloco = pipelineAtual[i];
      const tipoDoBloco = bloco.tipo;
      const chaveDoBloco = window.obterChaveDoBloco ? window.obterChaveDoBloco(bloco.id) : "";
      const operacao = window.ModoReverseActive
        ? `${tipoDoBloco}_inverso`
        : tipoDoBloco;

      if (transformacoes[operacao]) {
        textoProcessado = await transformacoes[operacao](textoProcessado, chaveDoBloco);
      } else if (transformacoes[tipoDoBloco]) {
        textoProcessado = await transformacoes[tipoDoBloco](textoProcessado, chaveDoBloco);
      } else {
        textoProcessado = `[${tipoDoBloco.toUpperCase()}] ${textoProcessado}`;
      }

      historicoResultadosParciais.push(textoProcessado);
    }

    txtSaida.value = textoProcessado;
    ultimoTextoEntrada = textoOriginal;
    ultimoCaminhoTipos = [...caminhoAtualTipos];

    salvarEstado();
  });
}

if (btnInverter) {
  btnInverter.addEventListener("click", () => {
    window.ModoReverseActive = !window.ModoReverseActive;

    if (txtEntrada && txtSaida) {
      const novoTextoEntrada = txtSaida.value;
      txtEntrada.value = novoTextoEntrada;

      if (window.ModoReverseActive) {
        window.ancoraDescriptografia = novoTextoEntrada;
      }
    }

    // Muda o texto e a cor do botão primeiro, para o clique responder na hora.
    aplicarTextosModo(window.ModoReverseActive);

    // O resto (reordenar pipeline, redesenhar canvas, rodar a criptografia)
    // é mais pesado e roda logo depois, já com a cor atualizada na tela.
    requestAnimationFrame(() => {
      if (window.pipeline && window.pipeline.length > 0) {
        window.pipeline.reverse();

        if (typeof window.renderizarCanvas === "function") {
          window.renderizarCanvas();
        }
      }

      if (window.limparCacheOtimizacao) {
        window.limparCacheOtimizacao();
      }

      if (btnExecutar && !window.pipelinePossuiBlocoSemChave()) {
        btnExecutar.click();
      }

      salvarEstado();
    });
  });
}
const botaoLimpar = document.getElementById("limpar-pipeline");

txtEntrada.addEventListener("input", () => {
  if (!window.pipelinePossuiBlocoSemChave()) {
    btnExecutar.click();
  }
});

if (botaoLimpar) {
  botaoLimpar.addEventListener("click", () => {window.pipeline = [];
    if (canvas) {
      [...canvas.children].forEach((elemento) => {

        const temClasseBloco = [...elemento.classList].some((classe) =>
          classe.startsWith("bloco-")
        );
        if (temClasseBloco) {
          elemento.remove();}

      });
    }
    if (txtEntrada) {
      txtEntrada.value = "";}
    window.ancoraDescriptografia = "";

    if (txtSaida) {
      txtSaida.value = ""; }
    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao(); }
    if (typeof window.renderizarCanvas === "function") {
      window.renderizarCanvas(); }
    
    salvarEstado();

  });
  }

salvarEstado();




