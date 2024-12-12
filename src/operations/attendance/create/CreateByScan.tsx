import {useState, useEffect, FC} from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import {Add, Close, List as ListIcon} from "@mui/icons-material";
import {QrPageConfig} from ".";
import {AttendanceMovementType, UserIdentifier} from "@haapi/typescript-client";
import {createScanner, ScannerBox} from "./QrScanner";
import {qrcode} from "./config";
import {useNavigate} from "react-router-dom";
import {useNotify, useToggle} from "@/hooks";
import {createAttendance} from "./utils";
import {Loader} from "@/operations/common/components";
import {Html5QrcodeScanner} from "html5-qrcode";
import {LinkButton} from "../list";

export const CreateByScan = () => {
  const [openDialog, , toggleOpenDialog] = useToggle();
  const config = qrcode.getConfig();
  const [currentConfig, setCurrentConfig] = useState({
    type: config.type,
    open: false,
  });
  const [scanner, setScanner] = useState<Html5QrcodeScanner>();
  const [dialogData, setDialogData] = useState<UserIdentifier>();

  const navigate = useNavigate();

  useEffect(() => {
    scanner && scanner.clear();
  }, []);

  useEffect(() => {
    const newScanner = createScanner((data) => {
      setDialogData(data);
      toggleOpenDialog();
    });
    newScanner.render();
    setScanner(newScanner.scanner);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const cameraPermissionButton = document.querySelector(
        "#html5-qrcode-button-camera-permission"
      ) as HTMLButtonElement;
      cameraPermissionButton && cameraPermissionButton.click();
    }, 1000);
  }, [scanner]);

  const closeStream = () => {
    const closeButton = document.querySelector(
      "#html5-qrcode-button-camera-stop"
    ) as HTMLButtonElement;
    closeButton && closeButton.click();
    navigate("/attendance");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <LinkButton to="/attendance" icon={<ListIcon />} bottom="90px" />
      <LinkButton to="/attendance/create" icon={<Add />} bottom="30px" />
      <Box
        sx={{
          width: "100%",
          maxWidth: "750px",
          position: "relative",
        }}
      >
        <ScannerBox id="reader" />
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            gap: 1.5,
            top: 5,
            right: 5,
          }}
        >
          <QrPageConfig
            open={currentConfig.open}
            toggle={() =>
              setCurrentConfig({...currentConfig, open: !currentConfig.open})
            }
          />
          <IconButton onClick={closeStream}>
            <Close
              sx={{
                fontSize: "1.5em",
                color: "white",
              }}
            />
          </IconButton>
        </Box>
        <ConfirmDialog
          dialogData={dialogData!}
          openDialog={openDialog}
          toggleOpenDialog={toggleOpenDialog}
        />
      </Box>
    </Box>
  );
};

type ConfirmProps = {
  openDialog: boolean;
  toggleOpenDialog: () => void;
  dialogData: UserIdentifier;
};

const ConfirmDialog: FC<ConfirmProps> = ({
  openDialog,
  toggleOpenDialog,
  dialogData,
}) => {
  const notify = useNotify();
  const [isSaving, setIsSaving] = useState(false);
  const [attendanceType, setAttendanceType] = useState<AttendanceMovementType>(
    AttendanceMovementType.IN
  );
  const handleConfirm = async () => {
    setIsSaving(true);
    await createAttendance({
      studentId: dialogData?.id!,
      type: attendanceType,
      place: "IVANDRY",
      notify,
    });
    setIsSaving(false);
    toggleOpenDialog();
  };
  return (
    <Dialog open={openDialog}>
      <DialogTitle>Confirmer la présence</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Êtes-vous sûr de vouloir enregistrer la présence de :
        </Typography>
        <ul>
          <li>
            <strong>Nom:</strong> {dialogData?.last_name}
          </li>
          <li>
            <strong>Préom:</strong> {dialogData?.first_name}
          </li>
          <li>
            <strong>Référence:</strong> {dialogData?.ref}
          </li>
        </ul>
        <FormControl fullWidth>
          <Select
            size="small"
            value={attendanceType}
            onChange={(status) =>
              setAttendanceType(status.target.value as AttendanceMovementType)
            }
            sx={{
              backgroundColor: "white",
              color: "black",
            }}
          >
            <MenuItem value={AttendanceMovementType.IN}>Entrer</MenuItem>
            <MenuItem value={AttendanceMovementType.OUT}>Sortie</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          size="small"
          sx={{textTransform: "revert"}}
          disabled={isSaving}
          onClick={() => toggleOpenDialog()}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{textTransform: "revert"}}
          color="success"
          disabled={isSaving}
          onClick={() => handleConfirm()}
        >
          Confirmer {isSaving && <Loader />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
