import {useEffect, useState} from "react";
import {useDataProvider} from "react-admin";
import {useNotify} from "@/hooks/useNotify";

export const useStudentStatus = (studentId) => {
  const [isSuspended, setIsSuspended] = useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  useEffect(() => {
    const fetchCheckStatus = async () => {
      try {
        const {data} = await dataProvider.getOne("students", {
          id: studentId,
        });
        if (data.status === "SUSPENDED") {
          setIsSuspended(true);
        }
      } catch (error) {
        notify("Erreur de chargement. Merci de rafraîchir la page.");
      }
    };
    if (studentId) {
      fetchCheckStatus();
    }
  }, [studentId, dataProvider, notify]);

  return isSuspended;
};
