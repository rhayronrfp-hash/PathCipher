const abrirConfig = document.querySelector('[data-page="Config"]');
const fundoConfig = document.querySelector(".config-overlay");
const janelaConfig = document.querySelector(".config-modal");
const fecharConfig = document.querySelector(".fechar-ajustes");

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