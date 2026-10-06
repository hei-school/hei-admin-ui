import styled from "@emotion/styled";
import {AddOutlined, Download} from "@mui/icons-material";
import {Button, ButtonProps} from "@mui/material";
import {MouseEvent, ReactNode} from "react";
import {Link, RaRecord, useListContext} from "react-admin";
import {To} from "react-router-dom";
import {exportData} from "../../operations/utils";
import useHaListContext from "../haList/useHaListContext";

export const HaActionWrapper = styled("div")({
  "width": "100%",
  "& .MuiButton-root": {
    width: "100%",
    justifyContent: "start",
    gap: 7,
    paddingLeft: "15px",
    paddingTop: "7px",
    paddingBottom: "7px",
    color: "#474645",
    textTransform: "none",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
  },
});

export type ButtonBaseProps = Omit<ButtonProps, "onClick"> & {
  label?: string;
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  closeAction?: boolean;
};

export const ButtonBase = ({
  label = "",
  icon,
  onClick,
  closeAction = true,
  children,
  ...rest
}: Readonly<ButtonBaseProps>) => {
  const listContext = useHaListContext();

  const doAction = (event: MouseEvent<HTMLButtonElement>) => {
    closeAction && listContext.closeAction();
    onClick?.(event);
  };

  return (
    <HaActionWrapper>
      <Button startIcon={icon} onClick={doAction} {...rest}>
        {label}
        {children}
      </Button>
    </HaActionWrapper>
  );
};

export type LinkButtonProps = ButtonBaseProps & {
  to: To;
};

export const LinkButton = ({
  to,
  icon,
  label,
  ...rest
}: Readonly<LinkButtonProps>) => {
  return (
    <HaActionWrapper>
      <Link to={to} sx={{w: "100%"}}>
        <ButtonBase icon={icon} label={label} {...rest} />
      </Link>
    </HaActionWrapper>
  );
};

interface CreateButtonProps {
  resource?: string;
}

export const CreateButton = ({resource}: Readonly<CreateButtonProps>) => {
  const list = useListContext();
  return (
    <LinkButton
      label="Créer"
      to={`/${resource || list.resource}/create`}
      icon={<AddOutlined />}
      data-testid="create-button"
    />
  );
};

export type ExportButtonProps = ButtonBaseProps & {
  onExport?: (data: RaRecord[]) => void;
};

export const ExportButton = ({
  onExport = undefined,
  icon = undefined,
  ...rest
}: Readonly<ExportButtonProps>) => {
  const list = useListContext();
  const doExport = () =>
    onExport ? onExport(list.data) : exportData(list.data, [], list.resource);

  return (
    <ButtonBase
      icon={icon || <Download />}
      label="Exporter"
      onClick={doExport}
      {...rest}
    />
  );
};
