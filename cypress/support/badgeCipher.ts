const encrypt = async (payload: unknown, publicId: string) => {
  const seed = new TextEncoder().encode(`hei-badge:${publicId.toLowerCase()}`);
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", seed),
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      {name: "AES-GCM", iv},
      key,
      new TextEncoder().encode(JSON.stringify(payload))
    )
  );
  const ivAndCiphertext = new Uint8Array(iv.length + ciphertext.length);
  ivAndCiphertext.set(iv);
  ivAndCiphertext.set(ciphertext, iv.length);
  return btoa(String.fromCharCode(...ivAndCiphertext));
};

export const encryptedBadge =
  (publicId: string, payload: unknown) =>
  (request: {reply: (body: unknown) => void}) =>
    encrypt(payload, publicId).then((encrypted) =>
      request.reply({payload: encrypted})
    );
