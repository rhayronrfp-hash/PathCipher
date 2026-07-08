const botaoCopiar = document.querySelector(".cartao-painel:nth-child(2) .painel-copy");

if (botaoCopiar) {
  botaoCopiar.addEventListener("click", () => {
    const valor = document.getElementById("saída").value;
    if (valor.trim()) {
      navigator.clipboard.writeText(valor).catch(err => console.error("não deu certolol", err));
    }
  });
}
