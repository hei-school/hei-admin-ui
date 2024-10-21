import React, {useState} from "react";
import {useCreate} from "react-admin";
import {Box, Button} from "@mui/material";
import {AttendanceMovementType} from "@haapi/typescript-client";
import {qrcode} from "./config";
import {useNotify} from "react-admin";

export const Actions = ({studentId, sx = {}}) => {
  const [clicked, setClicked] = useState("");
  const [create] = useCreate();
  const notify = useNotify();

  const removeClicked = () => setTimeout(() => setClicked(""), 2500);

  const handlerClick = async (type) => {
    if (clicked === "") {
      const payload = {
        student_id: studentId,
        created_at: new Date().toISOString(),
        attendance_movement_type: type,
        place: "IVANDRY",
      };

      try {
        await create("attendance", {data: payload});
        setClicked(type);
        notify("Création réussie !", {type: "success"});
        removeClicked();
      } catch (error) {
        console.error("Failed to create attendance:", error);
        notify("Échec de la création.", {type: "error"});
      }
    }
  };

  return (
    <Box
      component="div"
      sx={{display: "flex", alignItems: "center", gap: 1, ...sx}}
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handlerClick(AttendanceMovementType.IN)}
      >
        {clicked === AttendanceMovementType.IN ? "Succès" : "Arriver"}
      </Button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() => handlerClick(AttendanceMovementType.OUT)}
      >
        {clicked === AttendanceMovementType.OUT ? "Succès" : "Sortie"}
      </Button>
    </Box>
  );
};
