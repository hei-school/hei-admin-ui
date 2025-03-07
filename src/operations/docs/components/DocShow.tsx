import {useNotify} from "@/hooks";
import PdfViewer from "@/operations/common/components/PdfViewer";
import {ToRaRecord} from "@/operations/common/utils/types.ts";
import {useViewType} from "@/operations/docs/hooks/useViewType";
import {OwnerType} from "@/operations/docs/types";
import {FileInfo} from "@haapi/typescript-client";
import {Container} from "@mui/material";
import {useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

export interface DocShowProps {
  owner: OwnerType;
  userId: string;
}

export const DocShow: React.FC<DocShowProps> = ({owner, userId}) => {
  const params = useParams();
  const notify = useNotify();
  const id = params.id!;
  const type = useViewType("SHOW");

  const {data: doc, isLoading} = useGetOne<ToRaRecord<FileInfo>>(
    "docs",
    {
      id,
      meta: {
        owner,
        userId,
        type,
      },
    },
    {
      onError: () => {
        notify(
          `An error occurred while retrieving document with id='${id}', type='${type}'`,
          {
            type: "error",
          }
        );
      },
      enabled: !!(userId && type && id && owner),
    }
  );

  if (!id || !owner || !userId || !type) return null;

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
