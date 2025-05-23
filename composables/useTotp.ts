const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function useTotp() {
  const base32 = (bytes: Uint8Array) => {
    let bits = 0;
    let value = 0;
    let output = "";

    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;

      while (bits >= 5) {
        output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    }

    return output;
  };

  const generate = (length = 16) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return base32(array);
  };

  return {
    generate,
  };
}
