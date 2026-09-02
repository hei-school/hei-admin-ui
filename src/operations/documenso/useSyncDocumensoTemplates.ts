import {useNotify} from "@/hooks";
import documensoTemplatesProvider from "@/providers/documensoTemplatesProvider";
import {useRole} from "@/security/hooks";
import {useEffect, useRef, useState} from "react";

export const useSyncDocumensoTemplates = () => {
  const role = useRole();
  const notify = useNotify();
  const canSync = role.isAdmin();
  const [isSyncing, setIsSyncing] = useState(canSync);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!canSync || hasSynced.current) {
      return;
    }
    hasSynced.current = true;

    const synchronise = async () => {
      try {
        const templates = await documensoTemplatesProvider.saveOrUpdate([]);
        notify(
          `${templates.length} modèle(s) synchronisé(s) depuis Documenso`,
          {
            type: "success",
          }
        );
      } catch {
        notify("Erreur lors de la synchronisation des modèles", {
          type: "error",
        });
      } finally {
        // La liste n'est montée qu'une fois isSyncing repassé à false : elle
        // charge donc le catalogue fraichement synchronisé d'elle-même.
        setIsSyncing(false);
      }
    };

    synchronise();
  }, [canSync, notify]);

  return {isSyncing};
};
