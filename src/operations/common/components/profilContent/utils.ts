import {WORK_STATUS_VALUE} from "@/operations/docs/components/SelectWorkStatus";
import {SPECIALIZATION_VALUE} from "@/operations/students/components";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";

export const renderSpecialization = (specialization_field: string): string =>
  SPECIALIZATION_VALUE[
    specialization_field as keyof typeof SPECIALIZATION_VALUE
  ] || EMPTY_TEXT;

export const renderWorkStatus = (workStatus: string): string =>
  WORK_STATUS_VALUE[workStatus as keyof typeof WORK_STATUS_VALUE] || EMPTY_TEXT;

export const renderExperienceDuration = ({
  commitment_begin_date,
  commitment_end_date,
}: {
  commitment_begin_date: string;
  commitment_end_date?: string;
}) => {
  if (!commitment_begin_date) return EMPTY_TEXT;

  const beginDate = formatDate(commitment_begin_date, false);
  const endDate = commitment_end_date
    ? `au ${formatDate(commitment_end_date, false)}`
    : `jusqu'à maintenant`;

  return `Du ${beginDate} ${endDate}`;
};
