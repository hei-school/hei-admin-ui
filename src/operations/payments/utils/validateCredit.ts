import {useCallback, useEffect, useState} from "react";
import {useDataProvider} from "react-admin";
import {Credit} from "@haapi-b0fc7615/typescript-client";

export const MINIMUM_CREDIT = 200000;

export const hasEnoughCredit = (credit: Credit | null | undefined): boolean => {
  return !!credit && (credit.amount ?? 0) >= MINIMUM_CREDIT;
};

export const validateAmountAgainstCredit = (
  amount: number | string,
  credit: Credit | null | undefined
): string | undefined => {
  if (!credit) {
    return undefined;
  }

  if (!hasEnoughCredit(credit)) {
    return `Votre crédit est inférieur à ${MINIMUM_CREDIT}Ar.`;
  }

  if (Number(amount) > (credit.amount ?? 0)) {
    return "Le montant saisi est supérieur à votre crédit actuel.";
  }

  return undefined;
};

export const useStudentCredit = (studentId: string | number) => {
  const dataProvider = useDataProvider();

  const [credit, setCredit] = useState<Credit | null>(null);

  const getStudentCredit = useCallback(async () => {
    if (!studentId) {
      setCredit(null);
      return null;
    }

    const result = await dataProvider.getOne("credits", {
      id: studentId,
    });

    const studentCredit = result.data as Credit;

    setCredit(studentCredit);

    return studentCredit;
  }, [studentId, dataProvider]);

  useEffect(() => {
    getStudentCredit();
  }, [getStudentCredit]);

  const canPayByCredit = hasEnoughCredit(credit);

  const validateCreditPayment = (amount: number | string) =>
    validateAmountAgainstCredit(amount, credit);

  return {
    credit,
    canPayByCredit,
    getStudentCredit,
    validateCreditPayment,
  };
};