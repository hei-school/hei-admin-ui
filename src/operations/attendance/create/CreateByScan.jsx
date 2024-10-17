import React, {useState, useEffect} from "react";
import {
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  styled,
} from "@mui/material";
import {ScanStatus, qrcode} from "./config";
import {useNavigate} from "react-router-dom";
import {Close} from "@mui/icons-material";
import {QrPageConfig} from ".";
import {AttendanceMovementType} from "@haapi/typescript-client";
import {createScanner, ScannerBox} from "./QrScanner";

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
  const navigate = useNavigate();

  //unmount event
  useEffect(() => () => scanner !== null && scanner.clear(), []);

  useEffect(() => {
    const newScanner = createScanner(setInfo);
    newScanner.render();

    setScanner(newScanner);
  }, [config.pause, config.box, config.fps]);

  const toggleType = () => {
    const newType =
      config.type === AttendanceMovementType.IN
        ? AttendanceMovementType.OUT
        : AttendanceMovementType.IN;
    setConfig({type: newType});
    setCurrent({...current, type: newType});
  };

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
        <Box sx={{position: "absolute", bottom: 5, width: "100%"}}>
          <FormControl component="form" fullWidth onChange={toggleType}>
            <RadioGroup
              value={current.type}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                m: 0,
                color: "white",
              }}
            >
              <FormControlLabel
                value={AttendanceMovementType.IN}
                control={<Radio sx={{color: "white"}} />}
                label="Entrer"
              />
              <FormControlLabel
                value={AttendanceMovementType.OUT}
                control={<Radio sx={{color: "white"}} />}
                label="Sortie"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};
