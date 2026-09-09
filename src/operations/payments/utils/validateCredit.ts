import {payableUnpaidFees} from "@/operations/fees/utils/feeEligibility";
import {
  Credit,
  Fee,
  Payment,
  PaymentStatus,
  PaymentTypeEnum,
} from "@haapi-b0fc7615/typescript-client";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useDataProvider, useGetList} from "react-admin";

export const MINIMUM_CREDIT = 60000;

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

const isPendingCreditPayment = (payment: Payment): boolean =>
  payment.type === PaymentTypeEnum.CREDIT &&
  payment.status === PaymentStatus.CREATED;

type FeeRecord = Fee & {id: string};

export const useReservedCredit = (studentId: string | number | undefined) => {
  const dataProvider = useDataProvider();
  const [reservedAmount, setReservedAmount] = useState(0);
  const [pendingCreditFeeIds, setPendingCreditFeeIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  const {data: fees = []} = useGetList<FeeRecord>(
    "fees",
    {filter: {studentId}, pagination: {page: 1, perPage: 100}},
    {enabled: !!studentId}
  );
  const payableFeeIds = useMemo(
    () => payableUnpaidFees(fees).map(({id}) => id),
    [fees]
  );

  useEffect(() => {
    let cancelled = false;
    if (payableFeeIds.length === 0) {
      setReservedAmount(0);
      setPendingCreditFeeIds(new Set());
      return;
    }
    setIsLoading(true);
    Promise.all(
      payableFeeIds.map((feeId) =>
        dataProvider
          .getList("payments", {
            filter: {feeId},
            pagination: {page: 1, perPage: 100},
            sort: {field: "id", order: "ASC"},
          })
          .then((response) => ({
            feeId,
            payments: response.data as Payment[],
          }))
      )
    )
      .then((responses) => {
        if (cancelled) return;
        let amount = 0;
        const feeIds = new Set<string>();
        responses.forEach(({feeId, payments}) => {
          const pending = payments.filter(isPendingCreditPayment);
          if (pending.length > 0) {
            feeIds.add(feeId);
            amount += pending.reduce((sum, p) => sum + (p.amount ?? 0), 0);
          }
        });
        setReservedAmount(amount);
        setPendingCreditFeeIds(feeIds);
      })
      .catch((error) => {
        console.warn("Crédit réservé indisponible :", error);
        if (!cancelled) {
          setReservedAmount(0);
          setPendingCreditFeeIds(new Set());
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [payableFeeIds.join(","), dataProvider]);

  return {reservedAmount, pendingCreditFeeIds, isLoading};
};

export const useStudentCredit = (studentId: string | number) => {
  const dataProvider = useDataProvider();
  const [rawCredit, setRawCredit] = useState<Credit | null>(null);
  const {reservedAmount, pendingCreditFeeIds} = useReservedCredit(studentId);
  const getStudentCredit = useCallback(async () => {
    if (!studentId) {
      setRawCredit(null);
      return null;
    }
    try {
      const result = await dataProvider.getOne("credits", {
        id: studentId,
      });
      const studentCredit = result.data as Credit;
      setRawCredit(studentCredit);
      return studentCredit;
    } catch (error) {
      console.warn("Crédit étudiant indisponible :", error);
      setRawCredit(null);
      return null;
    }
  }, [studentId, dataProvider]);
  useEffect(() => {
    getStudentCredit();
  }, [getStudentCredit]);
  const credit: Credit | null = rawCredit && {
    ...rawCredit,
    amount: Math.max(0, (rawCredit.amount ?? 0) - reservedAmount),
  };
  const canPayByCredit = hasEnoughCredit(credit);
  const validateCreditPayment = (amount: number | string) =>
    validateAmountAgainstCredit(amount, credit);
  return {
    credit,
    canPayByCredit,
    getStudentCredit,
    pendingCreditFeeIds,
    validateCreditPayment,
  };
};
