import {smsApi} from "@/providers/api";
import {useEffect, useState} from "react";

export const useSmsBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    smsApi()
      .getSmsBalance()
      .then(({data}) => {
        if (isMounted) {
          setBalance(data.availableBalance ?? null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {balance, isLoading, hasError};
};
