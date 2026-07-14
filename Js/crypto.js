const rot13Transform = (texto) => {
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

const transformacoesCrypto = {
  binario: (texto) => {
    return Array.from(new TextEncoder().encode(texto))
      .map((byte) => byte.toString(2).padStart(8, "0"))
      .join(" ");
  },

  binario_inverso: (texto) => {
    if (!texto.trim()) return "";

    return new TextDecoder().decode(
      new Uint8Array(
        texto
          .split(" ")
          .map((bin) => parseInt(bin, 2))
      )
    );
  },

  base64: (texto) => {
    try {
      return btoa(unescape(encodeURIComponent(texto)));
    } catch (e) {
      return "Erro na conversão para Base64";
    }
  },

  base64_inverso: (texto) => {
    try {
      return decodeURIComponent(escape(atob(texto)));
    } catch (e) {
      return "Erro na decodificação de Base64";
    }
  },

  rot13: (texto) => {
    return rot13Transform(texto);
  },

  rot13_inverso: (texto) => {
    return rot13Transform(texto);
  },

  morse: (texto) => {
    return texto
      .toUpperCase()
      .split("")
      .map((c) => {
        if (c === " ") return "/";
        return dicionarioMorse[c] || c;
      })
      .join(" ");
  },

  morse_inverso: (texto) => {
    if (!texto.trim()) return "";

    return texto
      .trim()
      .split(/\s+/)
      .map((cod) => dicionarioMorseInverso[cod] || cod)
      .join("")
      .toLowerCase();
  },

  hex: (texto) => {
    return Array.from(new TextEncoder().encode(texto))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ");
  },

  hex_inverso: (texto) => {
    if (!texto.trim()) return "";

    return new TextDecoder().decode(
      new Uint8Array(
        texto
          .split(" ")
          .map((h) => parseInt(h, 16))
      )
    );
  },

  aes: (texto) => `[AES] ${texto}`,
  aes_inverso: (texto) => texto.replace("[AES] ", ""),

  rsa: (texto) => `[RSA] ${texto}`,
  rsa_inverso: (texto) => texto.replace("[RSA] ", ""),

  chacha20: (texto) => `[ChaCha20] ${texto}`,
  chacha20_inverso: (texto) => texto.replace("[ChaCha20] ", ""),

  sha256: (texto) => `[SHA256] ${texto}`,
  sha256_inverso: (texto) => texto,

  sha512: (texto) => `[SHA512] ${texto}`,
  sha512_inverso: (texto) => texto,

  md5: (texto) => `[MD5] ${texto}`,
  md5_inverso: (texto) => texto,

  cesar: (texto) => `[Cesar] ${texto}`,
  cesar_inverso: (texto) => texto.replace("[Cesar] ", ""),

  vigenere: (texto) => `[Vigenere] ${texto}`,
  vigenere_inverso: (texto) => texto.replace("[Vigenere] ", ""),

  atbash: (texto) => `[Atbash] ${texto}`,
  atbash_inverso: (texto) => texto.replace("[Atbash] ", ""),

  ascii: (texto) => {
    return Array.from(new TextEncoder().encode(texto))
      .join(" ");
  },

  ascii_inverso: (texto) => {
    if (!texto.trim()) return "";

    return new TextDecoder().decode(
      new Uint8Array(
        texto
          .split(" ")
          .map((c) => parseInt(c, 10))
      )
    );
  },

  urlencode: (texto) => encodeURIComponent(texto),
  urlencode_inverso: (texto) => decodeURIComponent(texto),

  unicode: (texto) => {
    return Array.from(texto)
      .map((c) => "\\u{" + c.codePointAt(0).toString(16) + "}")
      .join("");
  },

  unicode_inverso: (texto) => {
    return texto.replace(/\\u\{([0-9a-f]+)\}/gi, (match, grp) =>
      String.fromCodePoint(parseInt(grp, 16))
    );
  }
};

window.transformacoes = transformacoesCrypto;