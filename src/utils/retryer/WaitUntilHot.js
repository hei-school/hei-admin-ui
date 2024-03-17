import {LoadingPage} from "ra-ui-materialui";
import React, {useState, useEffect} from "react";
import {healthApi} from "../../providers/api";

const MAX_ATTEMP = 10;

// TODO: create error page
export function WaitUntilHot({children}) {
  const [retryStatus, setRetryStatus] = useState({
    loading: true,
    error: null,
    attempt: 0,
  });

  useEffect(() => {
    const retryOnFailure = async () => {
      try {
        await healthApi().dummyTableShouldNotBeEmpty();
        setRetryStatus((prev) => ({
          ...prev,
          loading: false,
        }));
      } catch (err) {
        setRetryStatus((prev) => ({
          ...prev,
          attempt: prev.attempt + 1,
          error: err,
        }));
        console.error(`Attemp ${retryStatus.attempt} failed`);
      }
    };

    if (retryStatus.attempt < MAX_ATTEMP && retryStatus.loading) {
      retryOnFailure();
    }
  }, [retryStatus.attempt, retryStatus.loading]);

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
