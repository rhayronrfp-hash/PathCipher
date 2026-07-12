const alvo = document.querySelector("#project-name");
const lapis = document.querySelector(".lapis");

alvo.readOnly = true

function confirmarNome() {
  alvo.readOnly = true;
  alvo.blur();
}
function editarNome() {
  alvo.readOnly = false;
  alvo.focus();
  alvo.setSelectionRange(alvo.value.length, alvo.value.length);
}

lapis.addEventListener("click", editarNome);

alvo.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    confirmarNome();
  }
});

alvo.addEventListener("blur", () => {
  alvo.readOnly = true;
});

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

if (toggleRemoverAviso) {
  toggleRemoverAviso.checked = avisoFoiRemovidoPeloUsuario();
  toggleRemoverAviso.addEventListener("change", () => {
    salvarPreferenciaRemoverAviso(toggleRemoverAviso.checked);
  });
}