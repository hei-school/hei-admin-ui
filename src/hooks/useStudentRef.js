import {useEffect, useState} from "react";
import {useDataProvider} from "react-admin";
import {useParams} from "react-router-dom";
import {studentIdFromRaId} from "../providers/feeProvider";
import {useNotify} from "./useNotify";
import {useRole} from "@/security/hooks";

// remove when monitor is allowed to students.getOne
export const useStudentRef = (source) => {
  const role = useRole();
  const resource = role.isMonitor() ? "monitor-students" : "students";
  const notify = useNotify();
  const params = useParams();
  const dataProvider = useDataProvider();
  const studentId = studentIdFromRaId(params[source]);
  const [studentRef, setStudentRef] = useState("...");

  useEffect(() => {
    const fetchRef = async () => {
      try {
        const student = await dataProvider.getOne(resource, {
          id: studentId,
        });
        setStudentRef(student.data.ref);
      } catch (error) {
        notify("Erreur de chargement. Merci de rafraîchir la page.");
      }
    };

    if (studentId) {
      fetchRef();
    }
  }, [studentId]);

  return {studentRef, studentId};
};
