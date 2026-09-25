import {usersApi} from "@/providers/api";
import {useEffect, useState} from "react";

type OwnerAccount = {ref?: string; firstName?: string};

export const useOwnerAccount = (ownerId?: string) => {
  const [owner, setOwner] = useState<OwnerAccount | null>(null);
  const [isLoading, setIsLoading] = useState(!!ownerId);

  useEffect(() => {
    if (!ownerId) {
      setOwner(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    usersApi()
      .getAdminById(ownerId)
      .then(({data}) => {
        if (isMounted) setOwner({ref: data.ref, firstName: data.first_name});
      })
      .catch(() =>
        usersApi()
          .getManagerById(ownerId)
          .then(({data}) => {
            if (isMounted) {
              setOwner({ref: data.ref, firstName: data.first_name});
            }
          })
          .catch(() => {
            if (isMounted) setOwner(null);
          })
      )
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ownerId]);

  return {owner, isLoading};
};
