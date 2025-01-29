import {Upload} from "@mui/icons-material";
import {MenuItem, Popover, Typography} from "@mui/material";
import {useRef, useState} from "react";
import {useNotify} from "react-admin";
import {useToggle} from "../../../hooks/useToggle";
import {ButtonBase} from "../Button";
import {ImportDialog} from "./ImportDialog";
import {ImportInputFile} from "./ImportInputFile";

export function ImportButton({
  provider,
  optionalHeaders,
  validateData,
  minimalHeaders,
  transformData,
  resource,
}) {
  const notify = useNotify();
  const [isOpen, , toggle] = useToggle();
  const [isShown, , toggleMenu] = useToggle();
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);

  const openMenu = (e) => {
    toggleMenu();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    toggleMenu();
    setAnchorEl(null);
  };

  const doImport = async (data) => {
    const importValidate = validateData(data);
    if (importValidate.isValid) {
      const modifiedData = transformData ? transformData(data) : data;
      await provider(modifiedData).then(() =>
        notify(`Importation effectuée avec succès`, {
          type: "success",
          autoHideDuration: 1500,
        })
      );
    } else {
      notify(importValidate.message, {type: "error", autoHideDuration: 4000});
    }
  };

  return (
    <>
      <ButtonBase
        icon={<Upload />}
        id="import-button"
        onClick={openMenu}
        closeAction={false}
      >
        Importer
      </ButtonBase>
      <Popover
        open={isShown}
        onClose={closeMenu}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#8f8e8c",
            width: "100%",
            px: 2,
            mt: 1,
            mb: 1,
          }}
        >
          Choix d'Importation
        </Typography>
        <MenuItem
          data-testid="existantTemplate"
          sx={{color: "#4a4a48"}}
          onClick={() => {
            buttonRef.current.click();
          }}
        >
          A partir d'un template existant{" "}
          <ImportInputFile mutationRequest={doImport} ref={buttonRef} />
        </MenuItem>
        <MenuItem onClick={toggle} sx={{color: "#4a4a48"}}>
          A partir d'un nouveau template
        </MenuItem>
      </Popover>
      <ImportDialog
        resource={resource}
        optionalHeaders={optionalHeaders}
        minimalHeaders={minimalHeaders}
        toggle={toggle}
        isOpen={isOpen}
        transformData={transformData}
        validateData={validateData}
        provider={provider}
      />
    </>
  );
}
