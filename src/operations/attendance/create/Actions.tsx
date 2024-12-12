import {FC, useState} from "react";
import {Box, Button} from "@mui/material";
import {AttendanceMovementType} from "@haapi/typescript-client";
import {useNotify} from "react-admin";
import {createAttendance} from "./utils";

type ActionProps = {
  studentId: string;
  sx: {[key: string]: any};
};

export const Actions: FC<ActionProps> = ({studentId, sx = {}}) => {
  const [isSaving, setIsSaving] = useState(false);
  const notify = useNotify();

  const handlerClick = async (type: AttendanceMovementType) => {
    setIsSaving(true);
    await createAttendance({studentId, type, place: "IVANDRY", notify});
    setIsSaving(false);
  };

  return (
    <Box
      component="div"
      sx={{display: "flex", alignItems: "center", gap: 1, ...sx}}
    >
      <Button
        variant="outlined"
        size="small"
        color="primary"
        disabled={isSaving}
        onClick={() => handlerClick(AttendanceMovementType.IN)}
      >
        Arriver
      </Button>
      <Button
        variant="outlined"
        size="small"
        disabled={isSaving}
        color="warning"
        onClick={() => handlerClick(AttendanceMovementType.OUT)}
      >
        Sortie
      </Button>
    </Box>
  );
};
