import React from "react";
import {useRole} from "@/security/hooks/useRole";
import {ManagerFeeList, StudentFeeList} from "@/operations/fees/components";
import MonitorStudentList from "@/operations/monitorStudent/MonitorStudentList";
import {Box, Typography} from "@mui/material";
import MonitorList from "@/operations/monitors/MonitorList";
import {MonitorFeeList} from "./components/MonitorFeeList";

export const MPBS_STATUS_LABEL = {
  SUCCESS: "Paiement avec succès",
  FAILED: "Paiement échoué",
  PENDING: "Vérification en cours",
};

const FeeList = ({studentId, studentRef}) => {
  const {isStudent, isMonitor, isManager} = useRole();

  return (
    <Box>
      <Typography variant="h6">Liste des Frais</Typography>
      {isStudent() && (
        <StudentFeeList studentId={studentId} studentRef={studentRef} />
      )}
      {isManager() && (
        <ManagerFeeList studentId={studentId} studentRef={studentRef} />
      )}
      {isMonitor() && (
        <MonitorFeeList studentId={studentId} studentRef={studentRef} />
      )}
    </Box>
  );
};

export default FeeList;
