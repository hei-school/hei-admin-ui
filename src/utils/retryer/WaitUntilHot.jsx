import {healthApi} from "@/providers/api";
import {LoadingPage} from "@mui/material";
import {useEffect, useState} from "react";

const MAX_ATTEMP = 10;

// TODO: create error page
export function WaitUntilHot({children}) {
  const [retryStatus, setRetryStatus] = useState({
    loading: false,
    error: null,
    attempt: 0,
    resolve: false,
  });

  useEffect(() => {
    const retryOnFailure = async () => {
      try {
        await healthApi().dummyTableShouldNotBeEmpty();
        setRetryStatus((prev) => ({
          ...prev,
          loading: false,
          resolve: true,
        }));
      } catch (err) {
        setRetryStatus((prev) => ({
          ...prev,
          loading: false,
          attempt: prev.attempt + 1,
          error: err,
        }));
        console.error(`Attemp ${retryStatus.attempt} failed`);
      }
    };

    if (
      retryStatus.attempt < MAX_ATTEMP &&
      !retryStatus.loading &&
      !retryStatus.resolve
    ) {
      setRetryStatus((prev) => ({...prev, loading: true}));
      retryOnFailure();
    }
  }, [retryStatus.attempt, retryStatus.loading, retryStatus.resolve]);

  return (
    <>
      {retryStatus.loading ? (
        <LoadingPage
          loadingPrimary="Chargement"
          loadingSecondary="La page est en cours de chargement, merci de bien vouloir patienter."
        />
      ) : (
        children
      )}
    </>
  );
}
