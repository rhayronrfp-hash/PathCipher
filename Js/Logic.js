const botaoCopiar = document.querySelector(".cartao-painel:nth-child(2) .painel-copy");

if (botaoCopiar) {
  botaoCopiar.addEventListener("click", () => {
    const valor = document.getElementById("saída").value;
    if (valor.trim()) {
      navigator.clipboard.writeText(valor).catch(err => console.error("não deu certolol", err));
    }
  });
}
window.addEventListener("load", () => {
  const modalAviso = document.createElement("div");
  modalAviso.style.position = "fixed";
  modalAviso.style.top = "0";
  modalAviso.style.left = "0";
  modalAviso.style.width = "100vw";
  modalAviso.style.height = "100vh";
  modalAviso.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
  modalAviso.style.display = "flex";
  modalAviso.style.justifyContent = "center";
  modalAviso.style.alignItems = "center";
  modalAviso.style.zIndex = "99999";
  modalAviso.style.backdropFilter = "blur(2px)";
  
  const conteudoAviso = document.createElement("div");
  conteudoAviso.style.backgroundColor = "#006EDB";
  conteudoAviso.style.padding = "24px";
  conteudoAviso.style.borderRadius = "12px";
  conteudoAviso.style.maxWidth = "600px";
  conteudoAviso.style.width = "90%";
  conteudoAviso.style.textAlign = "center";
  conteudoAviso.style.border = "1px solid #3d3d5c";
  conteudoAviso.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";

  conteudoAviso.innerHTML = `
    <h1 style="color: white; margin-top: 0; font-family: 'Inter', sans-serif; font-size: 20px;">Atenção com as Letras!</h1>
    <p style="color: white; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; margin: 16px 0 24px 0;">
      Evite usar <strong>letras maiúsculas</strong> na caixa de entrada. Isso pode afetar os resultados da criptografia, pois alguns algoritmos não diferenciam maiúsculas de minúsculas ou alteram o comportamento padrão.
    </p>
    <button id="fechar-aviso" style="background-color: #2ecc71; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; transition: background 0.2s;">
      Entendido
    </button>
  `;

  modalAviso.appendChild(conteudoAviso);
  document.body.appendChild(modalAviso);

  const btnFechar = conteudoAviso.querySelector("#fechar-aviso");
  
  btnFechar.addEventListener("click", () => {
    modalAviso.style.opacity = "0";
    modalAviso.style.transition = "opacity 0.3s ease";
    setTimeout(() => modalAviso.remove(), 300);
  });
});



