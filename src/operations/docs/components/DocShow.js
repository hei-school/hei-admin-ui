import {useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {Container} from "@mui/material";
import {useViewType} from "../hooks/useViewType";
import PdfViewer from "../../common/components/PdfViewer";

export const DocShow = ({owner}) => {
  const params = useParams();

  const id = params.id;
  const type = useViewType("SHOW");

  const {isLoading, data: doc} = useGetOne("docs", {id, meta: {owner, type}});

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
