<h1 align="center">🔐 PathCipher</h1><p align="center">
  <b>Um sistema visual de criptografia e transformação de textos através de caminhos personalizados.</b>
</p><p align="center">
  Crie caminhos de processamento, combine diferentes algoritmos e visualize cada etapa da transformação do seu texto.
</p><br><h2>📌 Sobre o projeto</h2><p>
O <b>PathCipher</b> é uma aplicação web que permite criar fluxos personalizados de criptografia, codificação e transformação de textos através de blocos.
</p><p>
A proposta do projeto é transformar processos criptográficos em uma experiência visual, permitindo que o usuário monte seu próprio caminho de processamento e execute diferentes métodos em sequência.
</p><p>
Cada bloco representa uma transformação que pode ser adicionada ao caminho, possibilitando combinações únicas de processamento.
</p><h3>Exemplo de funcionamento:</h3><pre>
Texto original
      ↓
Base64
      ↓
ROT13
      ↓
Hexadecimal
      ↓
Resultado final
</pre><br><h2>✨ Funcionalidades</h2><h3>🔗 Sistema de caminhos</h3><ul>
  <li>Adição de diferentes blocos de transformação.</li>
  <li>Organização da ordem de execução.</li>
  <li>Criação de caminhos personalizados.</li>
  <li>Visualização do fluxo entre os blocos.</li>
</ul><h3>🔄 Modo reverso</h3><p>
Permite inverter o caminho de processamento para realizar o processo contrário das transformações aplicadas.
</p><pre>
Codificação:

Texto → Base64 → Hex

Modo reverso:

Hex → Base64 → Texto
</pre><br><h2>🔐 Métodos suportados</h2><p>
O projeto possui suporte para diferentes algoritmos de criptografia, hash e codificação.
</p><h3>Criptografia</h3><ul>
  <li>AES</li>
  <li>RSA</li>
  <li>ChaCha20</li>
</ul><h3>Hash</h3><ul>
  <li>SHA-256</li>
  <li>SHA-256-HMAC</li>
  <li>SHA-512</li>
  <li>SHA-512-HMAC</li>
  <li>MD5</li>
  <li>MD5-HMAC</li>
</ul><h3>Codificação</h3><ul>
  <li>Base64</li>
  <li>Hexadecimal</li>
  <li>Binário</li>
  <li>Morse</li>
  <li>ASCII</li>
  <li>Unicode</li>
  <li>URL Encode</li>
</ul><h3>Cifras clássicas</h3><ul>
  <li>ROT13</li>
  <li>Cifra de César</li>
  <li>Vigenère</li>
  <li>Atbash</li>
</ul><br><h2>⚙️ Sistema de chaves</h2><p>
Alguns algoritmos necessitam de chaves para funcionar corretamente.
</p><p>
O sistema permite configurar como uma chave será aplicada aos blocos:
</p><ul>
  <li>Apenas um bloco específico.</li>
  <li>Todos os blocos do mesmo tipo.</li>
  <li>Todos os blocos que utilizam chaves.</li>
</ul><br><h2>🖥️ Interface</h2><p>
O PathCipher possui uma interface baseada em blocos, permitindo visualizar todo o caminho de processamento.
</p><ul>
  <li>Entrada e saída de texto.</li>
  <li>Caminho visual de transformação.</li>
  <li>Blocos de processamento.</li>
  <li>Sistema de configurações.</li>
  <li>Modo claro/escuro.</li>
  <li>Sistema de idiomas.</li>
  <li>Área de créditos.</li>
</ul><br><h2>🚀 Tecnologias utilizadas</h2><h3>Front-end</h3><ul>
  <li>HTML5</li>
  <li>CSS3</li>
  <li>JavaScript</li>
</ul><h3>Recursos utilizados</h3><ul>
  <li>Web Crypto API</li>
  <li>LocalStorage</li>
  <li>Manipulação de DOM</li>
  <li>SVG para elementos visuais</li>
</ul><br><h2>⚠️ Avisos</h2><p>
Este projeto possui finalidade educacional e experimental.
</p><p>
Algoritmos de hash como MD5 e SHA não são métodos de criptografia reversível, portanto não podem ser descriptografados.
</p><p>
Para aplicações reais de segurança, utilize bibliotecas e protocolos amplamente auditados.
</p><br><h2>👤 Desenvolvedor</h2><p>
Desenvolvido por:
</p><p>
<b>Rhayron Fernandes</b>
</p><br><h2>📄 Licença</h2><p>
Este projeto está disponível sob a licença MIT.
</p>