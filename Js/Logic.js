window.transformacoes = transformacoesCrypto;


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

const botaoCopiar = document.querySelector(".cartao-painel:nth-child(2) .painel-copy");
const btnExecutar = document.querySelector(".executar");
const txtEntrada = document.querySelector(".cartao-painel .painel-texto");
const txtSaida = document.getElementById("saída");
const btnInverter = document.querySelector(".inverter");
const botoesSeta = document.querySelectorAll(".setas");
const btnVoltar = botoesSeta[0] || null;
const btnAvancar = botoesSeta[1] || null;
const canvas = document.getElementById("fluxo-container");

const tituloEntrada = document.querySelector(
  ".cartao-painel:nth-child(1) .top-painel span"
);
const tituloResultado = document.querySelector(
  ".cartao-painel:nth-child(2) .top-painel span"
);

if (botaoCopiar) {
  botaoCopiar.addEventListener("click", () => {
    const valor = document.getElementById("saída").value;

    if (valor.trim()) {
      navigator.clipboard
        .writeText(valor)
        .catch((err) => console.error("não deu certolol", err));
    }
  });
}

function textoDoBotaoInverter() {
  return btnInverter ? btnInverter.querySelector("span") : null;
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

  if (txtEntrada) txtEntrada.value = estado.entrada ?? "";
  if (txtSaida) txtSaida.value = estado.saida ?? "";

  if (tituloEntrada) tituloEntrada.textContent = estado.tituloEntrada || "";
  if (tituloResultado) tituloResultado.textContent = estado.tituloResultado || "";

  const textoBotao = textoDoBotaoInverter();
  if (textoBotao) {
    textoBotao.textContent = estado.botaoInverter || "";
  } else if (btnInverter) {
    btnInverter.textContent = estado.botaoInverter || "";
  }

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
  btnExecutar.addEventListener("click", () => {
    const textoOriginal = txtEntrada.value;
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
        }
      }

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

    for (let i = indexInicio; i < caminhoAtualTipos.length; i++) {
      const tipoDoBloco = caminhoAtualTipos[i];
      const operacao = window.ModoReverseActive
        ? `${tipoDoBloco}_inverso`
        : tipoDoBloco;

      if (transformacoes[operacao]) {
        textoProcessado = transformacoes[operacao](textoProcessado);
      } else if (transformacoes[tipoDoBloco]) {
        textoProcessado = transformacoes[tipoDoBloco](textoProcessado);
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
    const textoBotao = textoDoBotaoInverter();
    const botaoOriginal = textoBotao ? textoBotao.textContent : "";

    window.ModoReverseActive = !window.ModoReverseActive;

    if (window.ModoReverseActive) {
      if (tituloEntrada) tituloEntrada.textContent = "Descriptografar";
      if (tituloResultado) tituloResultado.textContent = "Descriptografia";
      if (textoBotao) {
        textoBotao.textContent = "Criptografar";
      } else {
        btnInverter.textContent = "Criptografar";
      }
    } else {
      if (tituloEntrada) tituloEntrada.textContent = "Criptografar";
      if (tituloResultado) tituloResultado.textContent = "Criptografia";
      if (textoBotao) {
        textoBotao.textContent = botaoOriginal || "Descriptografia";
      } else {
        btnInverter.textContent = botaoOriginal || "Descriptografia";
      }
    }

    if (window.pipeline && window.pipeline.length > 0) {
      window.pipeline.reverse();

      if (typeof window.renderizarCanvas === "function") {
        window.renderizarCanvas();
      }
    }

    if (window.limparCacheOtimizacao) {
      window.limparCacheOtimizacao();
    }

    if (txtEntrada && txtSaida) {
      const textoResultado = txtSaida.value;
      if (textoResultado.trim() !== "") {
        txtEntrada.value = textoResultado;
      }
    }

    if (btnExecutar) {
      btnExecutar.click();
    }

    salvarEstado();
  });
}
const botaoLimpar = document.getElementById("limpar-pipeline");

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