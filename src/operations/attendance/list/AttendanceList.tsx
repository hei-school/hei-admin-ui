import {FunctionField, TextField} from "react-admin";
import {QrCodeScanner, Add, ListAlt} from "@mui/icons-material";
import {Box} from "@mui/material";
import {formatDate} from "../utils";
import {LinkButton, AttendanceFilters} from ".";
import {HaList} from "@/ui/haList";
import {StudentAttendance} from "@haapi/typescript-client";

const Actions = () => {
  return (
    <Box>
      <AttendanceFilters />
    </Box>
  );
};

export const AttendanceList = () => {
  //const [showOne, setShowOne] = useState({status: false, record: null});

  //const handlerRowClick = (id: string, ressource: string, record)=> setShowOne({ status: true, record })

  return (
    <>
      <LinkButton to="create" icon={<Add />} bottom="90px" />
      <LinkButton to="scan" icon={<QrCodeScanner />} bottom="30px" />
      <HaList
        title="Présences"
        resource="attendance"
        listProps={{title: "Présences"}}
        icon={<ListAlt />}
        actions={<Actions />}
        datagridProps={{rowClick: false}}
        mainSearch={{
          label: "Rechercher par étudiant",
          source: "student_key_word",
        }}
      >
        <TextField source="student.ref" label="Référence" />
        <TextField source="student.last_name" label="Nom·s" />
        <TextField source="student.first_name" label="Prénom·s" />
        <FunctionField
          label="Cours"
          render={(record: StudentAttendance) =>
            record.course_session?.awareded_course?.course?.code || "---"
          }
        />
        <FunctionField
          label="Heure"
          render={(record: StudentAttendance) =>
            formatDate(record.created_at) || "---"
          }
        />
        <TextField source="place" label="Lieu" />
      </HaList>
      {/* <ShowOne showOne={showOne} setShowOne={setShowOne} /> */}
    </>
  );
};
