const CHAVE_REMOVER_AVISO = "pathcipher_remover_aviso";

function salvarPreferenciaRemoverAviso(ativo) {
  try {
    localStorage.setItem(CHAVE_REMOVER_AVISO, ativo ? "1" : "0");
  } catch (erro) {
    console.error("Não foi possível salvar a preferência do aviso:", erro);
  }
}

function avisoFoiRemovidoPeloUsuario() {
  try {
    return localStorage.getItem(CHAVE_REMOVER_AVISO) === "1";
  } catch (erro) {
    return false;
  }
}

window.salvarPreferenciaRemoverAviso = salvarPreferenciaRemoverAviso;
window.avisoFoiRemovidoPeloUsuario = avisoFoiRemovidoPeloUsuario;
const toggleRemoverAviso = document.querySelector("#toggle-remover-aviso");
window.toggleRemoverAviso = toggleRemoverAviso;

if (toggleRemoverAviso) {
  toggleRemoverAviso.checked = avisoFoiRemovidoPeloUsuario();}

const CHAVE_TEMA = "pathcipher_tema";
const CHAVE_TAMANHO_BLOCOS = "pathcipher_tamanho_blocos";
const CHAVE_DISTANCIA_BLOCOS = "pathcipher_distancia_blocos";
const CHAVE_MOSTRAR_LINHAS = "pathcipher_mostrar_linhas";

function salvarPreferenciaTema(valor) {
  try {
    localStorage.setItem(CHAVE_TEMA, valor);
  } catch (erro) {
    console.error("Não foi possível salvar a preferência de tema:", erro);
  }
}

function obterPreferenciaTema() {
  try {
    return localStorage.getItem(CHAVE_TEMA) || "sistema";
  } catch (erro) {
    return "sistema";
  }
}

function aplicarTema(valor) {
  let temaResolvido = valor;

  if (temaResolvido === "sistema") {
    const prefereEscuro =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    temaResolvido = prefereEscuro ? "escuro" : "claro";
  }

  document.documentElement.setAttribute("data-tema", temaResolvido);
}

window.salvarPreferenciaTema = salvarPreferenciaTema;
window.obterPreferenciaTema = obterPreferenciaTema;
window.aplicarTema = aplicarTema;

const radiosTema = document.querySelectorAll('input[name="tema"]');

if (radiosTema.length) {
  const temaSalvo = obterPreferenciaTema();
  radiosTema.forEach((radio) => {
    radio.checked = radio.value === temaSalvo;
  });
  aplicarTema(temaSalvo);
}

if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (obterPreferenciaTema() === "sistema") {
      aplicarTema("sistema");
    }
  });
}

function salvarPreferenciaTamanhoBlocos(valor) {
  try {
    localStorage.setItem(CHAVE_TAMANHO_BLOCOS, valor);
  } catch (erro) {
    console.error("Não foi possível salvar a preferência de tamanho dos blocos:", erro);
  }
}

function obterPreferenciaTamanhoBlocos() {
  try {
    return localStorage.getItem(CHAVE_TAMANHO_BLOCOS) || "normal";
  } catch (erro) {
    return "normal";
  }
}

function aplicarTamanhoBlocos(valor) {
  document.documentElement.setAttribute("data-tamanho-blocos", valor);
}

window.salvarPreferenciaTamanhoBlocos = salvarPreferenciaTamanhoBlocos;
window.obterPreferenciaTamanhoBlocos = obterPreferenciaTamanhoBlocos;
window.aplicarTamanhoBlocos = aplicarTamanhoBlocos;

const radiosTamanho = document.querySelectorAll('input[name="tamanho"]');

if (radiosTamanho.length) {
  const tamanhoSalvo = obterPreferenciaTamanhoBlocos();
  radiosTamanho.forEach((radio) => {
    radio.checked = radio.value === tamanhoSalvo;
  });
  aplicarTamanhoBlocos(tamanhoSalvo);
}

function salvarPreferenciaDistanciaBlocos(valor) {
  try {
    localStorage.setItem(CHAVE_DISTANCIA_BLOCOS, valor);
  } catch (erro) {
    console.error("Não foi possível salvar a preferência de distância entre blocos:", erro);
  }
}

function obterPreferenciaDistanciaBlocos() {
  try {
    return localStorage.getItem(CHAVE_DISTANCIA_BLOCOS) || "normal";
  } catch (erro) {
    return "normal";
  }
}

function aplicarDistanciaBlocos(valor) {
  document.documentElement.setAttribute("data-distancia-blocos", valor);
}

window.salvarPreferenciaDistanciaBlocos = salvarPreferenciaDistanciaBlocos;
window.obterPreferenciaDistanciaBlocos = obterPreferenciaDistanciaBlocos;
window.aplicarDistanciaBlocos = aplicarDistanciaBlocos;

const radiosDistancia = document.querySelectorAll('input[name="distância"]');

if (radiosDistancia.length) {
  const distanciaSalva = obterPreferenciaDistanciaBlocos();
  radiosDistancia.forEach((radio) => {
    radio.checked = radio.value === distanciaSalva;
  });
  aplicarDistanciaBlocos(distanciaSalva);
}

function salvarPreferenciaMostrarLinhas(ativo) {
  try {
    localStorage.setItem(CHAVE_MOSTRAR_LINHAS, ativo ? "1" : "0");
  } catch (erro) {
    console.error("Não foi possível salvar a preferência de mostrar linhas:", erro);
  }
}

function obterPreferenciaMostrarLinhas() {
  try {
    const valor = localStorage.getItem(CHAVE_MOSTRAR_LINHAS);
    return valor === null ? true : valor === "1";
  } catch (erro) {
    return true;
  }
}

window.salvarPreferenciaMostrarLinhas = salvarPreferenciaMostrarLinhas;
window.obterPreferenciaMostrarLinhas = obterPreferenciaMostrarLinhas;

const checkboxMostrarLinhas = document.querySelector(".mostrar-linha");

if (checkboxMostrarLinhas) {
  checkboxMostrarLinhas.checked = obterPreferenciaMostrarLinhas();
}