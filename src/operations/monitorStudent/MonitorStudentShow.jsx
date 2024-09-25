import React from "react";
import {SimpleShowLayout, TextField, Show, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {DocMenu} from "@/operations/students/components/DocMenu";

const MonitorStudentShow = () => {
  const {studentId} = useParams();
  const {data, isLoading} = useGetOne("monitor-students", {studentId});

  return (
    <Show title="Détails de l'étudiant" resource="monitor-students" id={studentId}>
      <ProfileLayout
        role={WhoamiRoleEnum.STUDENT}
        isStudent
        actions={<DocMenu/>}
        isStudentProfile 
      >
      </ProfileLayout>
    </Show>
  );
};

export default MonitorStudentShow;
