import {FunctionField, TextField} from "react-admin";
import {LinkButton} from "../list";
import {QrCodeScanner, List as ListIcon, ListAlt} from "@mui/icons-material";
import {Actions} from ".";
import {Student} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList";
import {FilterForm, TextFilter} from "@/ui/haToolbar";

export const CreateByList = () => {
  return (
    <>
      <LinkButton to="/attendance" icon={<ListIcon />} bottom="90px" />
      <LinkButton
        to="/attendance/scan"
        icon={<QrCodeScanner />}
        bottom="30px"
      />
      <HaList
        title="Présences"
        resource="students"
        listProps={{title: "Présences"}}
        icon={<ListAlt />}
        mainSearch={{label: "Référence", source: "ref"}}
        actions={<ListActions />}
        datagridProps={{rowClick: false}}
      >
        <TextField source="ref" label="Référence" />
        <TextField source="first_name" label="Prénom·s" />
        <TextField source="last_name" label="Nom·s" />
        <FunctionField
          render={(record: Student) => (
            <Actions
              sx={{gap: 2, justifyContent: "end"}}
              studentId={record.id!}
            />
          )}
        />
      </HaList>
    </>
  );
};

const ListActions = () => {
  return (
    <FilterForm>
      <TextFilter label="Référence" source="ref" />
      <TextFilter label="Nom" source="last_name" />
      <TextFilter label="Prénom" source="first_name" />
    </FilterForm>
  );
};
