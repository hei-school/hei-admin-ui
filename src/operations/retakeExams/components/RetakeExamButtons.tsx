import {useRole} from "@/security/hooks";
import {RetakeExam, RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {Cancel, CheckCircle, HowToReg} from "@mui/icons-material";
import {Box, Button, Stack} from "@mui/material";
import {Confirm, useRecordContext} from "react-admin";
import {RetakeExamButtonStatus} from "./RetakeExamButtonStatus";
import {useButtonActions} from "./useButtonActions";

const BUTTON_STYLE = {
  "height": 28,
  "borderRadius": 50,
  "fontSize": 12.5,
  "fontWeight": 500,
  "px": 1.8,
  "textTransform": "none",
  "lineHeight": 1.2,
  "transition": "all 0.15s ease",
  "& .MuiButton-startIcon": {
    fontSize: 16,
    marginRight: 0.5,
  },
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
} as const;

type ButtonsProps = {
  onSuccess?: (retakeExam: RetakeExam) => void;
};

export const RetakeExamButtons = ({onSuccess}: ButtonsProps) => {
  const retakeExam = useRecordContext<RetakeExam>();
  if (!retakeExam) return null;
  const {isAdmin, isManager} = useRole();
  const canValidateCancel = isAdmin() || isManager();
  const {
    status: rawStatus,
    isRegistering,
    isCanceling,
    isValidatingCancel,
    setIsRegistering,
    setIsCanceling,
    setIsValidatingCancel,
    handleRegister,
    handleRequestCancel,
    handleValidateCancel,
  } = useButtonActions(retakeExam, onSuccess);

  const status = (rawStatus ?? null) as RetakeExamStatus | "LOADING" | null;

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        {!(canValidateCancel && status === RetakeExamStatus.TO_CANCEL) && (
          <RetakeExamButtonStatus status={status} />
        )}
        {!canValidateCancel && (
          <>
            {!status && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<HowToReg />}
                sx={BUTTON_STYLE}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRegistering(true);
                }}
              >
                S'inscrire
              </Button>
            )}

            {status === RetakeExamStatus.REGISTERED && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                sx={BUTTON_STYLE}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCanceling(true);
                }}
              >
                Annuler
              </Button>
            )}
          </>
        )}

        {canValidateCancel && status === RetakeExamStatus.TO_CANCEL && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            sx={BUTTON_STYLE}
            onClick={(e) => {
              e.stopPropagation();
              setIsValidatingCancel(true);
            }}
          >
            Valider l'annulation
          </Button>
        )}
      </Stack>

      <Confirm
        isOpen={isRegistering}
        title="Confirmation d'inscription"
        content={`Voulez-vous vous inscrire au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`}
        confirm="Confirmer l'inscription"
        onConfirm={handleRegister}
        onClose={() => setIsRegistering(false)}
      />

      <Confirm
        isOpen={isCanceling}
        title="Demande d'annulation"
        content={`Souhaitez-vous demander l'annulation de votre inscription au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`}
        confirm="Confirmer la demande"
        onConfirm={handleRequestCancel}
        onClose={() => setIsCanceling(false)}
      />

      <Confirm
        isOpen={isValidatingCancel}
        title="Validation d'une annulation"
        content="Souhaitez-vous valider la demande d'annulation de ce rattrapage ?"
        confirm="Valider"
        onConfirm={handleValidateCancel}
        onClose={() => setIsValidatingCancel(false)}
      />
    </Box>
  );
};
