export const removeExtension = (filename = "") =>
  filename.split(".").slice(0, -1);
