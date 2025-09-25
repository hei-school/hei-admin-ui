import {HaList} from "@/ui/haList";
import {BookOpenIcon} from "lucide-react";
import {DateField, TextField} from "react-admin";

export const RetakeExamessionList = () => {
  return (
    <HaList
      title="Listes des sessions"
      resource="retakeExams-sessions"
      icon={<BookOpenIcon />}
      listProps={{
        title: "Listes sessions rattrapages",
        disableRowClick: true,
        rowClick: false,
      }}
      actions={undefined}
    >
      <TextField source="title" label="Non du session" />
      <DateField source="date_from" label="Début" />
      <DateField source="date_to" label="Fin" />
    </HaList>
  );
};
