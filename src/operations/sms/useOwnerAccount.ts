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

    const fetchOwner = async () => {
      try {
        const {data} = await usersApi().getAdminById(ownerId);
        if (isMounted) setOwner({ref: data.ref, firstName: data.first_name});
      } catch {
        try {
          const {data} = await usersApi().getManagerById(ownerId);
          if (isMounted) setOwner({ref: data.ref, firstName: data.first_name});
        } catch {
          if (isMounted) setOwner(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchOwner();

    return () => {
      isMounted = false;
    };
  }, [ownerId]);

  return {owner, isLoading};
};
