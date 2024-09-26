import React from "react";
import {useRole} from "@/security/hooks/useRole";
import {StudentFeeList, ManagerFeeList} from "@/operations/fees/components";
import {Box, Typography} from "@mui/material";

export const MPBS_STATUS_LABEL = {
  SUCCESS: "Paiement avec succès",
  FAILED: "Paiement échoué",
  PENDING: "Vérification en cours",
};

const FeeList = ({studentId, studentRef}) => {
  const role = useRole();

  return (
    <Box>
      <Typography variant="h6">Liste des Frais</Typography>
      {(role.isStudent() || role.isMonitor()) && (
        <StudentFeeList studentId={studentId} studentRef={studentRef} />
      )}
      {role.isManager() && (
        <ManagerFeeList studentId={studentId} studentRef={studentRef} />
      )}
    </Box>
  );
};

export default FeeList;
