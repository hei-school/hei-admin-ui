import React, {useState} from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  useNotify,
  useRefresh,
} from "react-admin";
import {CreateGeoLocalisation} from "@/operations/common/components";
import {SexRadioButton} from "@/operations/utils";
import {StudentListWithBulkActions} from "../common/components";
import {EditToolBar} from "../utils";
import monitorProvider from "@/providers/monitorProvider";

const transformMonitor = (record, students) => {
  const {
    entrance_datetime,
    longitude,
    latitude,
    status = "ENABLED",
    ...monitor
  } = record;

  return {
    ...monitor,
    entrance_datetime: entrance_datetime
      ? new Date(entrance_datetime).toISOString()
      : null,
    coordinates: {longitude, latitude},
    status,
    students_ids: students
      .filter((student) => student.id)
      .map((student) => student.id),
  };
};

const MonitorCreate = () => {
  const [students, setStudents] = useState([]);
  const notify = useNotify();
  const refresh = useRefresh();

  const handleSubmit = async (record) => {
    try {
      const monitorData = transformMonitor(record, students);

      await monitorProvider.saveOrUpdate(
        [monitorData],
        {isUpdate: false},
        students
      );

      notify("Moniteur créé et étudiants liés avec succès", {type: "info"});
      refresh();
    } catch (error) {
      notify(
        `Erreur lors de la création du moniteur: ${error.response?.data?.message || error.message}`,
        {type: "error"}
      );
      throw error;
    }
  };

  return (
    <Create
      title="Moniteurs"
      onSuccess={() => {
        notify("Moniteur créé avec succès", {type: "info"});
        refresh();
      }}
    >
      <SimpleForm toolbar={<EditToolBar />} onSubmit={handleSubmit}>
        <TextInput source="ref" label="Référence" required fullWidth />
        <TextInput source="first_name" label="Prénoms" required fullWidth />
        <TextInput source="last_name" label="Nom" required fullWidth />
        <SexRadioButton />
        <TextInput source="phone" label="Téléphone" fullWidth />
        <TextInput
          source="nic"
          label="Numéro CIN"
          fullWidth
          validate={(value) =>
            value && value.length > 12
              ? "Le numéro CIN ne doit pas dépasser 12 caractères."
              : undefined
          }
        />
        <CreateGeoLocalisation />
        <TextInput source="birth_place" label="Lieu de naissance" fullWidth />
        <DateInput source="birth_date" label="Date de naissance" fullWidth />
        <TextInput multiline source="address" label="Adresse" fullWidth />
        <TextInput source="email" label="Email" required fullWidth />
        <DateInput
          source="entrance_datetime"
          label="Date d'entrée chez HEI"
          required
          fullWidth
        />

        <StudentListWithBulkActions setStudentsIds={setStudents} />
      </SimpleForm>
    </Create>
  );
};

export default MonitorCreate;
