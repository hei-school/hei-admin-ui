export const PORTRAIT_PHOTO_REQUIRED =
  "La photo doit être en portrait (plus haute que large).";
export const UNREADABLE_PHOTO = "Cette image ne peut pas être lue.";

const shownSizeOf = async (file: Blob) => {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  try {
    return {width: bitmap.width, height: bitmap.height};
  } finally {
    bitmap.close();
  }
};

export const portraitPhoto = async (value?: {rawFile?: Blob}) => {
  const file = value?.rawFile;
  if (!file) return undefined;
  try {
    const {width, height} = await shownSizeOf(file);
    return height > width ? undefined : PORTRAIT_PHOTO_REQUIRED;
  } catch {
    return UNREADABLE_PHOTO;
  }
};
