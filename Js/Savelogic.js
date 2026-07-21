window.chavesBlocos = window.chavesBlocos || [];
window.chavesPadraoPorTipo = window.chavesPadraoPorTipo || {};
window.chavePadraoGeral =
  typeof window.chavePadraoGeral === "string" ? window.chavePadraoGeral : "";

function encontrarRegistroChave(id) {
  return window.chavesBlocos.find((registro) => registro.id === id) || null;
}

function obterChaveDoBloco(id) {
  const registro = encontrarRegistroChave(id);
  return registro ? registro.chave : "";
}

function salvarChaveDoBloco(id, tipo, chave) {
  const registro = encontrarRegistroChave(id);
  if (registro) {
    registro.chave = chave;
    registro.tipo = tipo;
  } else {
    window.chavesBlocos.push({ id, tipo, chave });
  }
}

function removerChaveDoBloco(id) {
  window.chavesBlocos = window.chavesBlocos.filter((registro) => registro.id !== id);}

function chavePadraoParaTipo(tipo) {
  if (Object.prototype.hasOwnProperty.call(window.chavesPadraoPorTipo, tipo)) {
    return window.chavesPadraoPorTipo[tipo];
  }
  return window.chavePadraoGeral || "";
}

function aplicarChaveComEscopo(idOrigem, tipoOrigem, chave, escopo) {
  salvarChaveDoBloco(idOrigem, tipoOrigem, chave);

  if (escopo === "tipo") {
    window.chavesPadraoPorTipo[tipoOrigem] = chave;
    (window.pipeline || []).forEach((bloco) => {
      if (bloco.tipo === tipoOrigem) salvarChaveDoBloco(bloco.id, bloco.tipo, chave);
    });
  } else if (escopo === "geral") {
    window.chavePadraoGeral = chave;
    (window.pipeline || []).forEach((bloco) => {
      if (window.tiposComChave && window.tiposComChave.includes(bloco.tipo)) {
        salvarChaveDoBloco(bloco.id, bloco.tipo, chave);
      }
    });
  }}

const criaroarquivo = document.querySelector(".salvamento")

criaroarquivo.addEventListener("click", () => {
  
});

window.obterChaveDoBloco = obterChaveDoBloco;
window.salvarChaveDoBloco = salvarChaveDoBloco;
window.removerChaveDoBloco = removerChaveDoBloco;
window.chavePadraoParaTipo = chavePadraoParaTipo;
window.aplicarChaveComEscopo = aplicarChaveComEscopo;
