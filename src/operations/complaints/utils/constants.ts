import {
  ComplaintStatus,
  ComplaintType,
} from "@haapi-3d601c85/typescript-client";

export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  [ComplaintType.ACADEMIC]: "Académique",
  [ComplaintType.FINANCIAL]: "Financière",
};

export const COMPLAINT_TYPE_CHOICES = [
  {
    id: ComplaintType.ACADEMIC,
    name: COMPLAINT_TYPE_LABELS[ComplaintType.ACADEMIC],
  },
  {
    id: ComplaintType.FINANCIAL,
    name: COMPLAINT_TYPE_LABELS[ComplaintType.FINANCIAL],
  },
];

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.CREATED]: "Créée",
  [ComplaintStatus.ASSIGNED]: "Assignée",
  [ComplaintStatus.IN_PROGRESS]: "En cours",
  [ComplaintStatus.RESOLVED]: "Résolue",
  [ComplaintStatus.REJECTED]: "Rejetée",
};

export const COMPLAINT_STATUS_CHOICES = Object.values(ComplaintStatus).map(
  (status) => ({id: status, name: COMPLAINT_STATUS_LABELS[status]})
);

export const COMPLAINT_STATUS_COLORS: Record<
  ComplaintStatus,
  "default" | "info" | "warning" | "success" | "error"
> = {
  [ComplaintStatus.CREATED]: "default",
  [ComplaintStatus.ASSIGNED]: "info",
  [ComplaintStatus.IN_PROGRESS]: "warning",
  [ComplaintStatus.RESOLVED]: "success",
  [ComplaintStatus.REJECTED]: "error",
};
