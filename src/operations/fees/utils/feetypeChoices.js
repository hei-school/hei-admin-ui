//TODO: retrieve this from haapi client
export const FEETYPE_CONFIG = {
  TUITION: "TUITION",
  HARDWARE: "HARDWARE",
};

export const FEETYPE_LABEL = {
  TUITION: "Ecolage",
  HARDWARE: "Matériel",
};

export const FEETYPE_CHOICES = Object.entries(FEETYPE_LABEL).map(
  ([value, label]) => ({value, label})
);
