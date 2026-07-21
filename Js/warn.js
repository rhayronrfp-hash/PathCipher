window.addEventListener("load", () => {
  if (window.avisoFoiRemovidoPeloUsuario && window.avisoFoiRemovidoPeloUsuario()) {
    return;
  }

const aviso = document.createElement("div");
  Object.assign(aviso.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "99999",
    backdropFilter: "blur(2px)" });
  
  const caixaAviso = document.createElement("div");
  Object.assign(caixaAviso.style, {
    backgroundColor: "#111219",
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "90%",
    textAlign: "center",
    border: "1px solid #3d3d5c",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)" });

  caixaAviso.innerHTML = `
    <h1 data-i18n="aviso.titulo" style="color: white; margin-top: 0; font-family: 'Inter', sans-serif; font-size: 20px;">Attetion to the Letters!</h1>
    <p data-i18n="aviso.texto" style="color: white; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; margin: 16px 0 24px 0;">
    Some algorithms such as Caesar and Vigenère have limitations with accented characters and certain special characters. SHA-256, SHA-512, MD5, and their HMAC variants are hash functions and cannot be reversed, meaning the original text cannot be recovered after their application. Morse code does not distinguish between uppercase and lowercase letters and therefore should not be mixed with other encryption or encoding methods, as this may cause information loss or unexpected results.
    </p>
    <button id="fechar-aviso" data-i18n="aviso.botao" style="background-color: #2ecc71; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; transition: background 0.2s;">Understand</button>`;

  aviso.appendChild(caixaAviso);
  document.body.appendChild(aviso);
  caixaAviso.querySelector("#fechar-aviso").addEventListener("click", () => {
    aviso.style.opacity = "0";
    aviso.style.transition = "opacity 0.3s ease";
    setTimeout(() => aviso.remove(), 300);}
);
});