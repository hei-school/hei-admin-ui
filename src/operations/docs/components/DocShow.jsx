import {useEffect, useState} from "react";
import {useDataProvider} from "react-admin";
import {useParams} from "react-router-dom";
import {Container} from "@mui/material";
import {useViewType} from "@/operations/docs/hooks/useViewType";
import PdfViewer from "@/operations/common/components/PdfViewer";
import {useNotify} from "@/hooks";

export const DocShow = ({owner, studentId}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [doc, setDoc] = useState({});
  const dataProvider = useDataProvider();
  const params = useParams();
  const notify = useNotify();

  const id = params.id;
  const type = useViewType("SHOW");
  const isSuspended = useStudentStatus(studentId);

  useEffect(() => {
    const doEffect = async () => {
      if (isSuspended) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      await dataProvider
        .getOne("docs", {id, meta: {owner, studentId, type}})
        .then((result) => {
          setDoc(result.data);
          setIsLoading(false);
        })
        .catch(() => {});
    };
    doEffect();
  }, [studentId, type, id, owner, isSuspended]);
  return (
    <Container fixed>
      <PdfViewer
        isPending={isLoading}
        url={doc?.file_url ?? ""}
        filename={doc?.name ?? "Document sans titre"}
        style={{
          marginTop: "10px",
        }}
      />
    </Container>
  );
};
