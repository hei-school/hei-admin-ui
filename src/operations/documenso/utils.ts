import {Promotion, StudentLevel} from "@haapi-3d601c85/typescript-client";

export const promotionLabel = ({name, ref}: Promotion) =>
  [ref, name].filter(Boolean).join(" — ");

export const levelOfTemplate = (title?: string) =>
  Object.values(StudentLevel).find((level) =>
    (title ?? "").toUpperCase().includes(level)
  );
