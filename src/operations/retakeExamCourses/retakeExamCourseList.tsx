import {FileDownloader} from "@/operations/common/components";
import dataProvider from "@/providers/dataProvider";
import {HaList} from "@/ui/haList";
import {Download} from "@mui/icons-material";
import {BookOpenCheckIcon} from "lucide-react";
import {ShowButton, TextField} from "react-admin";
import {useParams} from "react-router-dom";

export const RetakeExamCourseList = () => {
  const {id: sessionId} = useParams<{id: string}>();

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("retakeExams-session-participants-export", {
      id: sessionId ?? "",
    });
    return {data: file};
  };

  return (
    <HaList
      title="Liste des matières à rattraper"
      resource="retakeExams-courses"
      icon={<BookOpenCheckIcon />}
      datagridProps={{
        rowClick: false,
      }}
      mainSearch={{
        source: "code",
        label: "Cours ex: prog2",
      }}
      listProps={{
        title: " ",
        filter: {sessionId},
      }}
      actions={
        <FileDownloader
          downloadFunction={downloadFile}
          fileName="Liste des rattrapages de la session.xlsx"
          startIcon={<Download />}
          buttonText="Exporter"
          successMessage="Exportation en cours..."
          errorMessage="Une erreur est survenue lors de l'exportation du fichier."
          fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      }
    >
      <TextField source="code" label="Matière" />
      <TextField source="name" label="Titre" />
      <TextField source="level" label="Niveau" />
      <TextField source="credits" label="Crédits" />
      <ShowButton state={{sessionId}} />
    </HaList>
  );
};
