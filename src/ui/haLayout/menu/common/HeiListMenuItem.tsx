import dataProvider from "@/providers/dataProvider";
import {ShareInfo} from "@haapi/typescript-client";
import {Home as HeiDocsIcon} from "@mui/icons-material";
import {CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {ListMenuItem} from "../utils";

export const HeiListMenuItem = ({onClick}: {onClick?: () => void}) => {
  const [file, setFile] = useState<ShareInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const {data} = await dataProvider.getOne("hei-docs", {id: "id"});
        setFile(data);
      } catch (error) {
        console.error("Error fetching file:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <ListMenuItem
      to={file?.url || "#"}
      target="_blank"
      data-testid="hei-docs"
      label="HEI"
      icon={<HeiDocsIcon />}
      onClick={onClick}
    />
  );
};
