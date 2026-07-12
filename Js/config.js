const abrirConfig = document.querySelector('[data-page="Config"]');
const fundoConfig = document.querySelector(".config-overlay");
const janelaConfig = document.querySelector(".config-modal");
const fecharConfig = document.querySelector(".fechar-ajustes");
const botaodesalvar = document.querySelector(".botao-confirmar-ajustes")
const sideIcons = document.querySelectorAll(".side-icon");

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
  esconderConfiguracoes();
});


function iniciarIdioma() {
    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            fallbackLng: "pt",
            backend: {
                loadPath: 'Locales/languages/{{lng}}.json'
            }
        })
        .then(() => {
            atualizarIdioma();
        });
}

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
                
document.addEventListener("DOMContentLoaded", () => {
    iniciarIdioma();
});