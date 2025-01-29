import styled from "@emotion/styled";
import {AddOutlined, Download} from "@mui/icons-material";
import {Button} from "@mui/material";
import {Link, useListContext} from "react-admin";
import {exportData} from "../../operations/utils";
import useHaListContext from "../haList/useHaListContext";

export const HaActionWrapper = styled("div")({
  "width": "100%",
  "& .MuiButton-root": {
    width: "100%",
    justifyContent: "start",
    gap: 7,
    paddingLeft: "20px",
    paddingTop: "7px",
    paddingBottom: "7px",
    color: "#474645",
    textTransform: "none",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
  },
});

export function ButtonBase({
  label = "",
  icon,
  onClick,
  closeAction = true,
  children,
  ...rest
}) {
  const listContext = useHaListContext();

  const doAction = (event) => {
    closeAction && listContext.closeAction();
    onClick && onClick(event);
  };

  return (
    <HaActionWrapper>
      <Button startIcon={icon} onClick={doAction} {...rest}>
        {label}
        {children}
      </Button>
    </HaActionWrapper>
  );
}

export function LinkButton({to, icon, label, ...rest}) {
  return (
    <HaActionWrapper>
      <Link to={to} sx={{w: "100%"}}>
        <ButtonBase icon={icon} label={label} {...rest} />
      </Link>
    </HaActionWrapper>
  );
}

export function CreateButton({resource}) {
  const list = useListContext();
  return (
    <LinkButton
      label="Créer"
      to={`/${resource || list.resource}/create`}
      icon={<AddOutlined />}
      data-testid="create-button"
    />
  );
}

export function ExportButton({
  onExport = undefined,
  icon = undefined,
  ...rest
}) {
  const list = useListContext();
  const doExport = () =>
    onExport ? onExport(list.data) : exportData(list.data, [], list.resource);

  return (
    <ButtonBase
      icon={icon ? icon : <Download />}
      label="Exporter"
      onClick={doExport}
      {...rest}
    />
  );
}
