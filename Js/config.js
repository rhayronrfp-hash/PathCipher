const abrirConfig = document.querySelector('[data-page="Config"]');
const fundoConfig = document.querySelector(".config-overlay");
const janelaConfig = document.querySelector(".config-modal");
const fecharConfig = document.querySelector(".fechar-ajustes");
const botaodesalvar = document.querySelector(".botao-confirmar-ajustes")
const sideIcons = document.querySelectorAll(".side-icon");
const mainsideicon = document.querySelector(".principal")

function mostrarConfiguracoes() {
  fundoConfig.classList.add("ativo");
  janelaConfig.classList.add("ativo");
  document.body.style.overflow = "hidden";
}

function esconderConfiguracoes() {
  fundoConfig.classList.remove("ativo");
  janelaConfig.classList.remove("ativo");
  document.body.style.overflow = "";
}

abrirConfig.addEventListener("click", () => {
  mostrarConfiguracoes();
});

fecharConfig.addEventListener("click", ()=> {
  sideIcons.forEach((item) => {
      item.classList.remove("ativo");
      mainsideicon.classList.add("ativo")
    });
  esconderConfiguracoes();
});

fundoConfig.addEventListener("click", esconderConfiguracoes);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    esconderConfiguracoes();
  }
});

botaodesalvar.addEventListener('click', () => {
  sideIcons.forEach((item) => {
      item.classList.remove("ativo");
    });
    mainsideicon.classList.add("ativo")
  esconderConfiguracoes();
});

const CHAVE_IDIOMA = "pathcipher_idioma";
const radiosIdioma = document.querySelectorAll('input[name="idioma"]');
let idiomaSelecionado = localStorage.getItem(CHAVE_IDIOMA) || "pt";
function marcarIdiomaSelecionado(codigo) {
  radiosIdioma.forEach((radio) => {
    radio.checked = radio.value === codigo;
  });}

radiosIdioma.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      idiomaSelecionado = radio.value;}});});
  
function iniciarIdioma() {
  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
    lng: localStorage.getItem(CHAVE_IDIOMA) || undefined,
    fallbackLng: "pt",
    backend: {
      loadPath: "Locales/languages/{{lng}}.json",
    },})
    .then(() => {
      atualizarIdioma();
      const idiomaInicial = localStorage.getItem(CHAVE_IDIOMA) || i18next.language || "pt";
      idiomaSelecionado = idiomaInicial;
      marcarIdiomaSelecionado(idiomaInicial);
    });}

function atualizarIdioma() {
    document.documentElement.lang = i18next.language;
    document
        .querySelectorAll("[data-i18n]")
        .forEach(el => {

            el.textContent =
                i18next.t(el.dataset.i18n);});

    document
        .querySelectorAll("[data-i18n-title]")
        .forEach(el => {

            el.title =
                i18next.t(el.dataset.i18nTitle);});

    document
        .querySelectorAll("[data-i18n-alt]")
        .forEach(el => {

            el.alt =
                i18next.t(el.dataset.i18nAlt);});
    document
        .querySelectorAll('[data-i18n-placeholder]')
        .forEach(el => {

            el.placeholder =
                i18next.t(el.dataset.i18nPlaceholder);});
    document
        .querySelectorAll("[data-i18n-value]")
        .forEach(el => {

            el.value =
                i18next.t(el.dataset.i18nValue);});}

const mobile = window.innerWidth <= 768;
const tamanho = localStorage.getItem("tamanho-blocos");

function aplicarTamanhoBlocos(valor) {
  const root = document.documentElement;

  if (mobile) {
    if (valor === "pequeno") {
      root.style.setProperty("--bloco-size", "0.75");
    } else if (valor === "grande") {
      root.style.setProperty("--bloco-size", "1");
    } else {
      root.style.setProperty("--bloco-size", "0.86");}
    return;}
    
  if (valor === "pequeno") {
    root.style.setProperty("--bloco-size", "0.88");
  } else if (valor === "grande") {
    root.style.setProperty("--bloco-size", "1.12");
  } else {
    root.style.setProperty("--bloco-size", "1");}}

function aplicarDistanciaBlocos(valor) {
  const root = document.documentElement;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const tamanho = localStorage.getItem(CHAVE_TAMANHO_BLOCOS) || "normal";

  if (mobile) {
    if (valor === "curto") {
      if (tamanho === "normal") {
        root.style.setProperty("--bloco-gap", "15px");
      }
      else if (tamanho==="grande") { 
        root.style.setProperty("--bloco-gap", "20px");
      }
      else {
        root.style.setProperty("--bloco-gap", "10px");
      }
    } else if (valor === "longo") {
      root.style.setProperty("--bloco-gap", "45px");
    } else {
      root.style.setProperty("--bloco-gap", "30px");}
    return;}

  if (valor === "curto") {
    if (tamanho==="grande") {
    root.style.setProperty("--bloco-gap", "40px");
    }
    else {
    root.style.setProperty("--bloco-gap", "30px");}
  } else if (valor === "longo") {
    root.style.setProperty("--bloco-gap", "90px");
  } else {
    root.style.setProperty("--bloco-gap", "60px");}}
    
    
    
    
    
function salvarPreferenciaTamanhoBlocos(valor) {
  localStorage.setItem(CHAVE_TAMANHO_BLOCOS, valor);}

function salvarPreferenciaDistanciaBlocos(valor) {
  localStorage.setItem(CHAVE_DISTANCIA_BLOCOS, valor);}

function carregarPreferenciasBlocos() {
  const tamanho = localStorage.getItem(CHAVE_TAMANHO_BLOCOS) || "normal";
  const distancia = localStorage.getItem(CHAVE_DISTANCIA_BLOCOS) || "normal";
  const radioTamanho = document.querySelector(`input[name="tamanho"][value="${tamanho}"]`);
  const radioDistancia = document.querySelector(`input[name="distância"][value="${distancia}"]`);

  if (radioTamanho) radioTamanho.checked = true;
  if (radioDistancia) radioDistancia.checked = true;

  aplicarTamanhoBlocos(tamanho);
  aplicarDistanciaBlocos(distancia);}

window.aplicarTamanhoBlocos = aplicarTamanhoBlocos;
window.aplicarDistanciaBlocos = aplicarDistanciaBlocos;
window.salvarPreferenciaTamanhoBlocos = salvarPreferenciaTamanhoBlocos;
window.salvarPreferenciaDistanciaBlocos = salvarPreferenciaDistanciaBlocos;
window.carregarPreferenciasBlocos = carregarPreferenciasBlocos;  

document.addEventListener("DOMContentLoaded", () => {
  iniciarIdioma();
  carregarPreferenciasBlocos();});
