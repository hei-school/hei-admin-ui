import React, {useState, useEffect} from "react";
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
  styled,
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {QrPageConfig} from ".";
import {AttendanceMovementType} from "@haapi/typescript-client";
import {createScanner, ScannerBox} from "./QrScanner";
import {ScanStatus, qrcode} from "./config";
import {useNavigate} from "react-router-dom";
import attendanceProvider from "@/providers/attendanceProvider";

const StatusStyled = styled("p")({
  mt: 2,
  textAlign: "center",
  position: "absolute",
  bottom: "80px",
  width: "100%",
  left: 0,
  color: "rgb(0,240,0)",
});

export const CreateByScan = () => {
  const {setConfig} = qrcode;
  const config = qrcode.getConfig();
  const [info, setInfo] = useState({status: ScanStatus.NoScan, data: ""});
  const [current, setCurrent] = useState({type: config.type, open: false});
  const [scanner, setScanner] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [attendanceType, setAttendanceType] = useState(AttendanceMovementType.IN);
  const navigate = useNavigate();

  useEffect(() => () => scanner !== null && scanner.clear(), []);

  useEffect(() => {
    const newScanner = createScanner(setInfo, setOpenDialog, setDialogData);
    newScanner.render();
    setScanner(newScanner);
  }, [config.pause, config.box, config.fps]);

  const closeStream = () => {
    const closeButton = document.querySelector(
      "#html5-qrcode-button-camera-stop"
    );
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
      <Box
        sx={{
          width: "100%",
          maxWidth: "750px",
          height: "fit-content",
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
            open={current.open}
            toggle={() => setCurrent({...current, open: !current.open})}
          />
          <IconButton onClick={closeStream}>
            <Close
              sx={{
                "fontSize": "1.5em",
                "color": "white",
                ":hover": {backgroundColor: "rgba(0,0,0,.1)"},
              }}
            />
          </IconButton>
        </Box>
        {info.status === ScanStatus.Success && (
          <StatusStyled>{info.data}</StatusStyled>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirmer la présence</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Êtes-vous sûr de vouloir enregistrer la présence de :
            </Typography>
            <ul>
              <li><strong>Nom:</strong> {dialogData?.name}</li>
              <li><strong>Référence:</strong> {dialogData?.ref}</li>
            </ul>
            <FormControl fullWidth>
              <Select
                value={attendanceType}
                onChange={(e) => setAttendanceType(e.target.value)}
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
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button
              onClick={async () => {
                try {
                  await attendanceProvider.saveOrUpdate([{
                    place: "IVANDRY",
                    student_id: dialogData.id,
                    created_at: new Date().toISOString(),
                    attendance_movement_type: attendanceType,
                  }]);
                  setInfo({status: ScanStatus.Success, data: `${dialogData.name} a été enregistré avec succès.`});
                  setOpenDialog(false);
                  navigate("/attendance");
                } catch (error) {
                  setInfo({status: ScanStatus.Failed, data: "Erreur lors de la vérification."});
                  console.error("Erreur lors de l'enregistrement : ", error);
                }
              }}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
