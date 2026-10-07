const KEY_PREFIX = "hei-badge:";
const IV_BYTES = 12;

const keyOf = async (publicId: string) => {
  const seed = new TextEncoder().encode(KEY_PREFIX + publicId.toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", seed);
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
};

const bytesOf = (base64: string) =>
  Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));

export const decryptBadge = async <T>(
  payload: string,
  publicId: string
): Promise<T> => {
  const ivAndCiphertext = bytesOf(payload);
  const json = await crypto.subtle.decrypt(
    {name: "AES-GCM", iv: ivAndCiphertext.slice(0, IV_BYTES)},
    await keyOf(publicId),
    ivAndCiphertext.slice(IV_BYTES)
  );
  return JSON.parse(new TextDecoder().decode(json)) as T;
};
