const rot13Transform = (texto) => {
  if (!texto) return "";
  return texto.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    }

    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + 13) % 26) + 97);
    }

    return c;
  });
};

const tCrypto = (key, fallback) => {
  const i18n = window.i18next;
  if (i18n && typeof i18n.t === "function") {
    const translated = i18n.t(key);
    if (translated && translated !== key) return translated;
  }
  return fallback;
};

function safeDecodeURIComponent(texto, fallbackKey, fallbackText) {
  try {
    return decodeURIComponent(texto);
  } catch (e) {
    return tCrypto(fallbackKey, fallbackText);
  }
}

const dicionarioMorse = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..",
  J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",

  Á: ".--.-", Ä: ".-.-", Å: ".--.-", É: "..-..", Ñ: "--.--", Ö: "---.", Ü: "..--", Ç: "-.-..",

  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",

  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.",
  "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.",
  "$": "...-..-", "@": ".--.-."
};

const dicionarioMorseInverso = {
  ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F",
  "--.": "G", "....": "H", "..": "I", ".---": "J", "-.-": "K",
  ".-..": "L", "--": "M", "-.": "N", "---": "O", ".--.": "P",
  "--.-": "Q", ".-.": "R", "...": "S", "-": "T", "..-": "U",
  "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y", "--..": "Z",
  ".--.-": "Á", ".-.-": "Ä", "..-..": "É", "--.--": "Ñ", "---.": "Ö",
  "..--": "Ü", "-.-..": "Ç",

  "-----": "0", ".----": "1", "..---": "2", "...--": "3", "....-": "4",
  ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9",

  ".-.-.-": ".", "--..--": ",", "..--..": "?", ".----.": "'",
  "-.-.--": "!", "-..-.": "/", "-.--.": "(", "-.--.-": ")",
  ".-...": "&", "---...": ":", "-.-.-.": ";", "-...-": "=",
  ".-.-.": "+", "-....-": "-", "..--.-": "_", ".-..-.": '"',
  "...-..-": "$", ".--.-.": "@",

  "/": " "
};

function md5Bytes(bytes) {
  function rotl(x, c) { return (x << c) | (x >>> (32 - c)); }

  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21
  ];
  const K = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
  }

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  const origLenBits = bytes.length * 8;
  const msg = bytes.slice();
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);

  for (let i = 0; i < 8; i++) {
    msg.push(Number((BigInt(origLenBits) >> BigInt(8 * i)) & 0xffn));
  }

  for (let chunkStart = 0; chunkStart < msg.length; chunkStart += 64) {
    const M = [];
    for (let j = 0; j < 16; j++) {
      const o = chunkStart + j * 4;
      M[j] = (msg[o] | (msg[o + 1] << 8) | (msg[o + 2] << 16) | (msg[o + 3] << 24)) >>> 0;
    }

    let A = a0, B = b0, C = c0, D = d0;

    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + rotl(F, s[i])) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  function toHexLE(n) {
    let hex = "";
    for (let i = 0; i < 4; i++) hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    return hex;
  }

  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);}

function md5Hex(texto) {
  return md5Bytes(Array.from(new TextEncoder().encode(texto)));}

function hexParaBytes(hex) {
  const out = [];
  for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.substr(i, 2), 16));
  return out;}
  
function hmacHexGenerico(hashBytesFn, blockSize, keyBytes, msgBytes) {
  let key = keyBytes.slice();
  if (key.length > blockSize) key = hexParaBytes(hashBytesFn(key));
  while (key.length < blockSize) key.push(0);

  const ipad = key.map((b) => b ^ 0x36);
  const opad = key.map((b) => b ^ 0x5c);
  const inner = hexParaBytes(hashBytesFn(ipad.concat(msgBytes)));
  return hashBytesFn(opad.concat(inner));
}

function md5Transform(texto, chave) {
  if (!texto) return "";

  const msgBytes = Array.from(new TextEncoder().encode(texto));
  if (chave && chave.length) {
    const keyBytes = Array.from(new TextEncoder().encode(chave));
    return hmacHexGenerico(md5Bytes, 64, keyBytes, msgBytes);}
  return md5Bytes(msgBytes);}

function rotl32(x, n) { return ((x << n) | (x >>> (32 - n))) >>> 0; }

function chachaQuarterRound(st, a, b, c, d) {
  st[a] = (st[a] + st[b]) >>> 0; st[d] ^= st[a]; st[d] = rotl32(st[d], 16);
  st[c] = (st[c] + st[d]) >>> 0; st[b] ^= st[c]; st[b] = rotl32(st[b], 12);
  st[a] = (st[a] + st[b]) >>> 0; st[d] ^= st[a]; st[d] = rotl32(st[d], 8);
  st[c] = (st[c] + st[d]) >>> 0; st[b] ^= st[c]; st[b] = rotl32(st[b], 7);}

const CHACHA_CONST = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];

function chachaBlock(keyWords, counter, nonceWords) {
  const state = new Uint32Array(16);
  state.set(CHACHA_CONST, 0);
  state.set(keyWords, 4);
  state[12] = counter;
  state.set(nonceWords, 13);

  const working = Array.from(state);
  for (let i = 0; i < 10; i++) {
    chachaQuarterRound(working, 0, 4, 8, 12);
    chachaQuarterRound(working, 1, 5, 9, 13);
    chachaQuarterRound(working, 2, 6, 10, 14);
    chachaQuarterRound(working, 3, 7, 11, 15);
    chachaQuarterRound(working, 0, 5, 10, 15);
    chachaQuarterRound(working, 1, 6, 11, 12);
    chachaQuarterRound(working, 2, 7, 8, 13);
    chachaQuarterRound(working, 3, 4, 9, 14);
  }

  const out = new Uint32Array(16);
  for (let i = 0; i < 16; i++) out[i] = (working[i] + state[i]) >>> 0;

  const bytes = new Uint8Array(64);
  for (let i = 0; i < 16; i++) {
    bytes[i * 4] = out[i] & 0xff;
    bytes[i * 4 + 1] = (out[i] >>> 8) & 0xff;
    bytes[i * 4 + 2] = (out[i] >>> 16) & 0xff;
    bytes[i * 4 + 3] = (out[i] >>> 24) & 0xff;
  }
  return bytes;
}

function bytesParaWordsLE(bytes) {
  const words = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push((bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0);
  }
  return words;
}

function chacha20Xor(dataBytes, keyBytes, nonceBytes, counterStart) {
  const keyWords = bytesParaWordsLE(keyBytes);
  const nonceWords = bytesParaWordsLE(nonceBytes);
  const out = new Uint8Array(dataBytes.length);

  let counter = counterStart >>> 0;
  for (let offset = 0; offset < dataBytes.length; offset += 64) {
    const block = chachaBlock(keyWords, counter, nonceWords);
    const end = Math.min(64, dataBytes.length - offset);
    for (let i = 0; i < end; i++) out[offset + i] = dataBytes[offset + i] ^ block[i];
    counter = (counter + 1) >>> 0;
  }
  return out;
}

function chacha20KeyFromPassphrase(passphrase) {
  const p = passphrase && passphrase.length ? passphrase : "pathcipher";
  const parte1 = hexParaBytes(md5Hex(p));
  const parte2 = hexParaBytes(md5Hex(md5Hex(p) + ":chacha20:" + p));
  return new Uint8Array(parte1.concat(parte2));
}

function bytesParaBase64(bytes) {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function base64ParaBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function chacha20Encrypt(texto, chave) {
  if (!texto) return "";

  const key = chacha20KeyFromPassphrase(chave);
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const dataBytes = new TextEncoder().encode(texto);
  const cipherBytes = chacha20Xor(dataBytes, key, nonce, 1);

  const combined = new Uint8Array(nonce.length + cipherBytes.length);
  combined.set(nonce, 0);
  combined.set(cipherBytes, nonce.length);
  return bytesParaBase64(combined);
}

function chacha20Decrypt(textoBase64, chave) {
  if (!textoBase64 || !textoBase64.trim()) return "";
  try {
    const key = chacha20KeyFromPassphrase(chave);
    const combined = base64ParaBytes(textoBase64);
    const nonce = combined.slice(0, 12);
    const cipherBytes = combined.slice(12);
    const plainBytes = chacha20Xor(cipherBytes, key, nonce, 1);
    return new TextDecoder().decode(plainBytes);
  } catch (e) {
    return tCrypto("erro.chacha20_invalido", "[ChaCha20] Incorrect key or invalid ciphertext.");
  }
}

function rsaPemToBuffer(pem, type) {
  const cleanB64 = pem
    .replace(new RegExp(`-----BEGIN ${type}-----`), "")
    .replace(new RegExp(`-----END ${type}-----`), "")
    .replace(/\s+/g, "");
  const binaryDer = atob(cleanB64);
  const buf = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    buf[i] = binaryDer.charCodeAt(i);
  }
  return buf.buffer;
}

async function rsaEncryptReal(texto, chaveJson) {
  if (!texto) return "";
  try {
    let publicKeyPem = "";
    try {
      const parsed = JSON.parse(chaveJson);
      publicKeyPem = parsed.publicKey;
    } catch (e) {
      publicKeyPem = chaveJson;}

    if (!publicKeyPem || !publicKeyPem.includes("BEGIN PUBLIC KEY")) {
      return tCrypto("erro.rsa_publica_invalida", "[RSA Error] Invalid or missing public key.");}

    const keyBuffer = rsaPemToBuffer(publicKeyPem, "PUBLIC KEY");
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      keyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    const data = new TextEncoder().encode(texto);
    const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch (err) {
    console.error("RSA encryption error:", err);
    return tCrypto("erro.rsa_falha_criptografia", "[RSA Error] Encryption failed. Check the public key.");}}

async function rsaDecryptReal(textoBase64, chaveJson) {
  if (!textoBase64 || !textoBase64.trim()) return "";
  try {
    let privateKeyPem = "";
    try {
      const parsed = JSON.parse(chaveJson);
      privateKeyPem = parsed.privateKey;
    } catch (e) {
      return tCrypto("erro.rsa_privada_nao_encontrada", "[RSA Error] Private key not found in this block.");
    }

    if (!privateKeyPem || !privateKeyPem.includes("BEGIN PRIVATE KEY")) {
      return tCrypto("erro.rsa_privada_nao_configurada", "[RSA Error] No private key configured.");}

    const keyBuffer = rsaPemToBuffer(privateKeyPem, "PRIVATE KEY");
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );

    const binaryDer = atob(textoBase64);
    const data = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      data[i] = binaryDer.charCodeAt(i);
    }

    const decrypted = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, data);
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("RSA decryption error:", err);
    return tCrypto("erro.rsa_falha_descriptografia", "[RSA Error] Decryption failed. Incorrect key or corrupted data.");
  }
}

function rsaFormatarPem(base64, tipo) {
  return `-----BEGIN ${tipo}-----\n${base64.match(/.{1,64}/g).join("\n")}\n-----END ${tipo}-----`;
}

function rsaLimparEntradaParaBase64(entradaBruta) {
  return (entradaBruta || "")
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
}

async function rsaImportarChavePrivada(entradaBruta) {
  if (!entradaBruta || !entradaBruta.trim()) {
    throw new Error(tCrypto("erro.rsa_importar_vazio", "Paste a private key before confirming."));
  }

  const base64Limpo = rsaLimparEntradaParaBase64(entradaBruta);
  if (!base64Limpo) {
    throw new Error(tCrypto("erro.rsa_importar_interpretar", "The provided key could not be interpreted."));
  }

  let pkcs8Buffer;
  try {
    pkcs8Buffer = base64ParaBytes(base64Limpo).buffer;
  } catch (e) {
    throw new Error(tCrypto("erro.rsa_importar_base64", "Invalid Base64 key. Make sure you copied the entire content."));
  }

  let privateKey;
  try {
    privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      pkcs8Buffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );
  } catch (e) {
    console.error("RSA private key import error:", e);
    throw new Error(tCrypto("erro.rsa_importar_formato", "Invalid format or incompatible RSA key (expected PKCS#8)."));
  }

  let publicKey;
  try {
    const jwkPrivada = await window.crypto.subtle.exportKey("jwk", privateKey);
    const jwkPublica = {
      kty: jwkPrivada.kty,
      n: jwkPrivada.n,
      e: jwkPrivada.e,
      alg: jwkPrivada.alg,
      ext: true,
      key_ops: ["encrypt"]
    };
    publicKey = await window.crypto.subtle.importKey(
      "jwk",
      jwkPublica,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["encrypt"]
    );
  } catch (e) {
    console.error("RSA public key derivation error:", e);
    throw new Error(tCrypto("erro.rsa_importar_derivar", "Unable to derive the public key from the private key."));
  }

  const privExportado = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const pubExportado = await window.crypto.subtle.exportKey("spki", publicKey);

  return {
    privateKeyPem: rsaFormatarPem(bytesParaBase64(new Uint8Array(privExportado)), "PRIVATE KEY"),
    publicKeyPem: rsaFormatarPem(bytesParaBase64(new Uint8Array(pubExportado)), "PUBLIC KEY")
  };
}

function aesDerivarChave(passphrase, saltBytes) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"])
    .then((baseKey) => crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    ));
}

async function aesEncrypt(texto, chave) {
  if (!texto) return "";

  const passphrase = chave && chave.length ? chave : "pathcipher";
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await aesDerivarChave(passphrase, salt);
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(texto));
  const cipherBytes = new Uint8Array(cipherBuf);

  const combined = new Uint8Array(salt.length + iv.length + cipherBytes.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(cipherBytes, salt.length + iv.length);
  return bytesParaBase64(combined);
}

async function aesDecrypt(textoBase64, chave) {
  if (!textoBase64 || !textoBase64.trim()) return "";

  const passphrase = chave && chave.length ? chave : "pathcipher";

  try {
    const combined = base64ParaBytes(textoBase64);
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const cipherBytes = combined.slice(28);

    const key = await aesDerivarChave(passphrase, salt);

    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipherBytes
    );

    return new TextDecoder().decode(plainBuf);
  } catch (e) {
    return tCrypto("erro.aes_invalido", "[AES] Incorrect key or invalid ciphertext.");
  }
}

function bytesParaHex(buf) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function shaDigestHex(algoritmo, texto) {
  const buf = await crypto.subtle.digest(algoritmo, new TextEncoder().encode(texto));
  return bytesParaHex(buf);
}

async function shaHmacHex(algoritmo, chave, texto) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(chave), { name: "HMAC", hash: algoritmo }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(texto));
  return bytesParaHex(sig);
}

async function shaTransform(algoritmo, texto, chave) {
  if (!texto) return "";
  if (chave && chave.length) return shaHmacHex(algoritmo, chave, texto);
  return shaDigestHex(algoritmo, texto);
}

function cesarDeslocamentoDaChave(chave) {
  if (!chave || !chave.length) return 3;
  let soma = 0;
  for (let i = 0; i < chave.length; i++) soma += chave.charCodeAt(i);
  return soma % 26;
}

function cesarTransform(texto, chave, inverso) {
  if (!texto) return "";

  const base = cesarDeslocamentoDaChave(chave);
  const deslocamento = inverso ? (26 - base) % 26 : base;

  return texto.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + deslocamento) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + deslocamento) % 26) + 97);
    return c;
  });
}

function vigenereTransform(texto, chave, inverso) {
  if (!texto) return "";

  const chaveLimpa = (chave || "pathcipher").replace(/[^a-zA-Z]/g, "") || "pathcipher";
  let idx = 0;

  return texto.replace(/[a-zA-Z]/g, (c) => {
    const letraChave = chaveLimpa[idx % chaveLimpa.length];
    const chaveCode = letraChave.toUpperCase().charCodeAt(0) - 65;
    const deslocamento = inverso ? (26 - chaveCode) % 26 : chaveCode;
    idx++;

    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + deslocamento) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + deslocamento) % 26) + 97);
    return c;
  });
}

function atbashTransform(texto) {
  if (!texto) return "";
  return texto.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(90 - (code - 65));
    if (code >= 97 && code <= 122) return String.fromCharCode(122 - (code - 97));
    return c;
  });
}

const transformacoesCrypto = {
  binario: (texto) => {
    if (!texto) return "";
    return Array.from(new TextEncoder().encode(texto))
      .map((byte) => byte.toString(2).padStart(8, "0"))
      .join(" ");
  },

  binario_inverso: (texto) => {
    if (!texto || !texto.trim()) return "";
    try {
      const partes = texto.trim().split(/\s+/);
      const bytes = partes.map((bin) => {
        if (!/^[01]{8}$/.test(bin)) {
          throw new Error("invalid-binary");
        }
        return parseInt(bin, 2);
      });
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (e) {
      return tCrypto("erro.binario_invalido", "[Binary] incorrect format or invalid binary text.");
    }
  },

  base64: (texto) => {
    if (!texto) return "";
    try {
      return btoa(unescape(encodeURIComponent(texto)));
    } catch (e) {
      return tCrypto("erro.base64_codificacao_falha", "[Base64] failed to encode text.");
    }
  },

  base64_inverso: (texto) => {
    if (!texto || !texto.trim()) return "";
    try {
      return decodeURIComponent(escape(atob(texto)));
    } catch (e) {
      return tCrypto("erro.base64_decodificacao_falha", "[Base64] invalid or corrupted text.");
    }
  },

  rot13: (texto) => rot13Transform(texto),
  rot13_inverso: (texto) => rot13Transform(texto),

  morse: (texto) => {
    if (!texto) return "";
    return texto
      .split("")
      .map((c) => {
        if (c === " ") return "/";
        const codigo = dicionarioMorse[c.toUpperCase()];
        if (!codigo) return c;
        return codigo;
      })
      .join(" ");},

morse_inverso: (texto) => {
    if (!texto || !texto.trim()) return "";

    return texto
      .trim()
      .split(/\s+/)
      .map((cod) => {
        if (cod === "/") return " ";

        const letra = dicionarioMorseInverso[cod];

        if (!letra) return cod;

        return letra.toLowerCase();
      })
      .join("");
},

  hex: (texto) => {
    if (!texto) return "";
    return Array.from(new TextEncoder().encode(texto))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ");
  },

  hex_inverso: (texto) => {
    if (!texto || !texto.trim()) return "";
    try {
      const partes = texto.trim().split(/\s+/);
      const bytes = partes.map((h) => {
        if (!/^[0-9a-fA-F]{2}$/.test(h)) {
          throw new Error("invalid-hex");
        }
        return parseInt(h, 16);
      });
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (e) {
      return tCrypto("erro.hex_invalido", "[Hex] incorrect format or invalid hex text.");
    }
  },

  aes: (texto, chave) => aesEncrypt(texto, chave),
  aes_inverso: (texto, chave) => aesDecrypt(texto, chave),

  rsa: async (texto, chave) => await rsaEncryptReal(texto, chave),
  rsa_inverso: async (texto, chave) => await rsaDecryptReal(texto, chave),

  chacha20: (texto, chave) => chacha20Encrypt(texto, chave),
  chacha20_inverso: (texto, chave) => chacha20Decrypt(texto, chave),

  sha256: (texto) => shaDigestHex("SHA-256", texto),
  
  sha256hmac: (texto, chave) => shaHmacHex("SHA-256", chave, texto),
  sha256hmac_inverso: (texto) => texto,
  
  sha512: (texto) => shaDigestHex("SHA-512", texto),
  
  sha512hmac: (texto, chave) => shaHmacHex("SHA-512", chave, texto),
  sha512hmac_inverso: (texto) => texto,

  md5: (texto) => md5Hex(texto),
  md5hmac: (texto, chave) =>
  hmacHexGenerico(
    md5Bytes,
    64,
    Array.from(new TextEncoder().encode(chave)),
    Array.from(new TextEncoder().encode(texto))
  ),
  md5hmac_inverso: (texto) => texto,

  cesar: (texto, chave) => cesarTransform(texto, chave, false),
  cesar_inverso: (texto, chave) => cesarTransform(texto, chave, true),

  vigenere: (texto, chave) => vigenereTransform(texto, chave, false),
  vigenere_inverso: (texto, chave) => vigenereTransform(texto, chave, true),

  atbash: (texto) => atbashTransform(texto),
  atbash_inverso: (texto) => atbashTransform(texto),

  ascii: (texto) => {
    if (!texto) return "";
    return Array.from(new TextEncoder().encode(texto)).join(" ");
  },

  ascii_inverso: (texto) => {
    if (!texto || !texto.trim()) return "";
    try {
      const partes = texto.trim().split(/\s+/);
      const bytes = partes.map((c) => {
        const n = Number(c);
        if (!Number.isInteger(n) || n < 0 || n > 255) {
          throw new Error("invalid-ascii");
        }
        return n;
      });
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (e) {
      return tCrypto("erro.ascii_invalido", "[ASCII] incorrect format or invalid ASCII text.");
    }
  },

  urlencode: (texto) => {
    if (!texto) return "";
    return encodeURIComponent(texto);
  },

  urlencode_inverso: (texto) => {
    if (!texto) return "";
    return safeDecodeURIComponent(texto, "erro.urlencode_invalido", "[URL Encode] invalid or corrupted text.");
  },

  unicode: (texto) => {
    if (!texto) return "";
    return Array.from(texto)
      .map((c) => "\\u{" + c.codePointAt(0).toString(16) + "}")
      .join("");
  },

  unicode_inverso: (texto) => {
    if (!texto) return "";
    try {
      return texto.replace(/\\u\{([0-9a-f]+)\}/gi, (match, grp) =>
        String.fromCodePoint(parseInt(grp, 16))
      );
    } catch (e) {
      return tCrypto("erro.unicode_invalido", "[Unicode] invalid or corrupted text.");
    }
  }
};

window.tiposComChave = ["aes", "rsa", "chacha20", "cesar", "vigenere", "md5hmac", "sha256hmac", "sha512hmac"];
window.transformacoes = transformacoesCrypto;