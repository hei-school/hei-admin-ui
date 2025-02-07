import {differenceInYears, isBefore} from "date-fns";

export const isOver18 = (birthDate: string): boolean => {
  const birth = new Date(birthDate);
  const now = new Date();
  return (
    differenceInYears(now, birth) > 18 ||
    (differenceInYears(now, birth) === 18 && isBefore(birth, now))
  );
};
