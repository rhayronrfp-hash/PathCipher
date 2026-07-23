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
window.reverseHerdouPipeline = false;

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
  if (!window.reverseHerdouPipeline) return;
  const pipelineAtual = window.pipeline || [];

  if (pipelineAtual.length === 0) {
    txtEntrada.value = window.ancoraDescriptografia || "";
    return;}
  return;}

window.atualizarPreviewDescriptografia = atualizarPreviewDescriptografia;
async function regenerarAncoraReversa() {
  if (!window.ModoReverseActive) return;
  if (!window.reverseHerdouPipeline) return; 
  if (typeof window.textoOriginalAntesReverse !== "string") return;

  const pipelineEmOrdemDeCriptografia = [...(window.pipeline || [])].reverse();
  let texto = window.textoOriginalAntesReverse;

  for (const bloco of pipelineEmOrdemDeCriptografia) {
    const chaveDoBloco = window.obterChaveDoBloco
      ? window.obterChaveDoBloco(bloco.id)
      : "";

    const precisaDeChave =
      window.tiposComChave && window.tiposComChave.includes(bloco.tipo);

    const temChave =
      !precisaDeChave || (chaveDoBloco && String(chaveDoBloco).trim() !== "");

    if (!temChave) continue;

    if (transformacoes[bloco.tipo]) {
      texto = await transformacoes[bloco.tipo](texto, chaveDoBloco);
    }
  }

  window.ancoraDescriptografia = texto;
  if (txtEntrada) txtEntrada.value = texto;
}
window.regenerarAncoraReversa = regenerarAncoraReversa;

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

function t(key, fallback) {
  const i18n = window.i18next;
  if (i18n && typeof i18n.t === "function") {
    const translated = i18n.t(key);
    if (translated && translated !== key) return translated;
  }
  return fallback;
}

function aplicarTextoI18n(elemento, definicao) {
  if (!elemento || !definicao) return;
  elemento.setAttribute("data-i18n", definicao.chave);
  elemento.textContent = t(definicao.chave, definicao.texto);
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
  if (typeof window.atualizarIdioma === "function") {
  window.atualizarIdioma();
}
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
    reverseHerdouPipeline: window.reverseHerdouPipeline,
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
  window.reverseHerdouPipeline = !!estado.reverseHerdouPipeline;
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

let geracaoExecucao = 0;

if (btnExecutar && txtEntrada && txtSaida) {
  btnExecutar.addEventListener("click", async () => {
      if (!txtEntrada.value.trim()) { txtSaida.value = ""; 
      return;}
    const minhaGeracao = ++geracaoExecucao;

    const textoOriginal = window.ModoReverseActive && typeof window.ancoraDescriptografia === "string" && window.ancoraDescriptografia !== ""
    ? window.ancoraDescriptografia
    : txtEntrada.value;

    const pipelineAtual = window.pipeline || [];

    const caminhoAtualTipos = pipelineAtual.map((bloco) => {
      const chaveDoBlocoAtual = window.obterChaveDoBloco
        ? window.obterChaveDoBloco(bloco.id)
        : (bloco.chave || "");
      return `${bloco.tipo}::${chaveDoBlocoAtual || ""}`;
    });

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
          break;}}

      if (correspondencias > 0) {
        indexInicio = correspondencias;
        textoProcessado = historicoResultadosParciais[correspondencias - 1];}}

    if (indexInicio === 0) {
      historicoResultadosParciais = [];
    } else {
      historicoResultadosParciais =
        historicoResultadosParciais.slice(0, indexInicio);
    }

    for (let i = indexInicio; i < pipelineAtual.length; i++) {
      const bloco = pipelineAtual[i];
      const tipoDoBloco = bloco.tipo;

      const chaveDoBloco =
        window.obterChaveDoBloco
          ? window.obterChaveDoBloco(bloco.id)
          : "";

      const precisaDeChave =
        window.tiposComChave &&
        window.tiposComChave.includes(tipoDoBloco);

      const temChave =
        !precisaDeChave ||
        (chaveDoBloco && String(chaveDoBloco).trim() !== "");

      if (temChave) {
        const operacao = window.ModoReverseActive
          ? `${tipoDoBloco}_inverso`
          : tipoDoBloco;
        if (transformacoes[operacao]) {
          textoProcessado = await transformacoes[operacao](
            textoProcessado,
            chaveDoBloco
          );
        } else if (transformacoes[tipoDoBloco]) {
          textoProcessado = await transformacoes[tipoDoBloco](
            textoProcessado,
            chaveDoBloco
          );
        } else {
          textoProcessado = `[${tipoDoBloco.toUpperCase()}] ${textoProcessado}`;
        }

        if (minhaGeracao !== geracaoExecucao) return;
      }

      historicoResultadosParciais.push(textoProcessado);}
    txtSaida.value = textoProcessado;
    ultimoTextoEntrada = textoOriginal;
    ultimoCaminhoTipos = [...caminhoAtualTipos];

    salvarEstado();
  });}

if (btnInverter) {
  btnInverter.addEventListener("click", () => {
    const estavaNoModoReverse = window.ModoReverseActive;
    const textoOriginalAntesDaTroca = txtEntrada ? txtEntrada.value : "";

    window.ModoReverseActive = !window.ModoReverseActive;

    if (txtEntrada && txtSaida) {

      const resultadoAtual = txtSaida.value;

      if (window.ModoReverseActive) {
        txtEntrada.value = resultadoAtual;
        window.ancoraDescriptografia = resultadoAtual;
        window.textoOriginalAntesReverse = textoOriginalAntesDaTroca;
        window.reverseHerdouPipeline = (window.pipeline || []).length > 0;} 
      else {

        if (window.textoOriginalAntesReverse !== undefined) {
          txtEntrada.value = window.textoOriginalAntesReverse;}
        window.ancoraDescriptografia = "";
        window.reverseHerdouPipeline = false;
      }}


    aplicarTextosModo(window.ModoReverseActive);
    requestAnimationFrame(() => {

      if (window.pipeline && window.pipeline.length > 0) {
        window.pipeline.reverse();

        if (typeof window.renderizarCanvas === "function") {
          window.renderizarCanvas();}}

      if (window.limparCacheOtimizacao) {
        window.limparCacheOtimizacao();
      }


      if (btnExecutar) {
        btnExecutar.click();}


      if (window.salvarEstado) {
        window.salvarEstado();}

    });});}
    
const botaoLimpar = document.getElementById("limpar-pipeline");

txtEntrada.addEventListener("input", () => {
  btnExecutar.click();
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