import {useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {Container} from "@mui/material";
import {useType} from "../hooks/useType";
import PdfViewer from "../../common/components/PdfViewer";

export const DocShow = ({owner}) => {
  const params = useParams();

  const id = params.id;
  const type = useType("SHOW");

  const queryDoc = useGetOne("docs", {id, meta: {owner, type}});
  const doc = queryDoc.data;

  return (
    <Container fixed>
      <PdfViewer
        style={{
          marginTop: "10px",
        }}
        url={doc?.file_url ?? ""}
        filename={doc?.name ?? "Document sans titre"}
      />
    </Container>
  );
};
