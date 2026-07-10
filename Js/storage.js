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