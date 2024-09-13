import React from "react";
import {SimpleShowLayout, TextField, Show, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {WhoamiRoleEnum} from "@haapi/typescript-client";

const MonitorStudentShow = () => {
  const {studentId} = useParams();
  const {data, isLoading} = useGetOne("monitor-students", {studentId});

  return (
    <Show title="Détails de l'étudiant" resource="monitor-students" id={studentId}>
      <ProfileLayout role={WhoamiRoleEnum.STUDENT} isStudent>
        <SimpleShowLayout>
          <TextField source="ref" label="Référence" />
          <TextField source="first_name" label="Prénom" />
          <TextField source="last_name" label="Nom" />
        </SimpleShowLayout>
      </ProfileLayout>
    </Show>
  );
};

export default MonitorStudentShow;
