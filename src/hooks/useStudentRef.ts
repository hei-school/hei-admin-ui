import {ToRaRecord} from "@/operations/common/utils/types";
import {Student} from "@haapi-b0fc7615/typescript-client";
import {useEffect, useState} from "react";
import {useDataProvider} from "react-admin";
import {useParams} from "react-router-dom";
import {studentIdFromRaId} from "../providers/feeProvider";
import {useNotify} from "./useNotify";

export const useStudentRef = (source: string) => {
  const notify = useNotify();
  const params = useParams();
  const dataProvider = useDataProvider();
  const studentId = studentIdFromRaId(params[source] ?? "");
  const [studentRef, setStudentRef] = useState("...");

  useEffect(() => {
    const fetchRef = async () => {
      try {
        const student = await dataProvider.getOne<ToRaRecord<Student>>(
          "students",
          {
            id: studentId,
          }
        );
        setStudentRef(student.data.ref ?? "");
      } catch {
        notify("Erreur de chargement. Merci de rafraîchir la page.");
      }
    };

    if (studentId) {
      void fetchRef();
    }
  }, [studentId]);

  return {studentRef, studentId};
};
