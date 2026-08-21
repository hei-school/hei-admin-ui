import {useRole} from "@/security/hooks";
import {RetakeExam, RetakeExamStatus} from "@haapi-3d601c85/typescript-client";
import {
  Block,
  Cancel,
  CheckCircle,
  DoDisturbOn,
  HowToReg,
  Verified,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import {useState} from "react";
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
  const {isAdmin, isManager} = useRole();
  const [cancelReason, setCancelReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const {
    status: rawStatus,
    isRegistering,
    isCanceling,
    isValidatingCancel,
    isRejectingCancel,
    isValidate,
    isInValidate,
    setIsRegistering,
    setIsCanceling,
    setIsValidatingCancel,
    setIsRejectingCancel,
    setIsValidate,
    setIsInValidate,
    handleRegister,
    handleRequestCancel,
    handleValidateCancel,
    handleRejectCancel,
    handleInvalidate,
    handleValidate,
  } = useButtonActions(retakeExam, onSuccess);

  if (!retakeExam) return null;

  const canValidateCancel = isAdmin() || isManager();
  const status = (rawStatus ?? null) as RetakeExamStatus | "LOADING" | null;

  const handleCancelSubmit = () => {
    if (cancelReason.trim()) {
      handleRequestCancel(cancelReason);
      setCancelReason("");
    }
  };
  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      handleRejectCancel(rejectReason);
      setRejectReason("");
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        {!(
          canValidateCancel &&
          (status === RetakeExamStatus.TO_CANCEL ||
            status === RetakeExamStatus.REGISTERED)
        ) && <RetakeExamButtonStatus status={status} />}
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

            {status === RetakeExamStatus.REGISTERED &&
              !retakeExam.rejection_reason && (
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
          <>
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
              Valider
            </Button>

            <Button
              variant="contained"
              color="warning"
              startIcon={<Block />}
              sx={BUTTON_STYLE}
              onClick={(e) => {
                e.stopPropagation();
                setIsRejectingCancel(true);
              }}
            >
              Rejeter
            </Button>
          </>
        )}
        {canValidateCancel && status === RetakeExamStatus.REGISTERED && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<Verified />}
              sx={BUTTON_STYLE}
              onClick={(e) => {
                e.stopPropagation();
                setIsValidate(true);
              }}
            >
              Valider
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DoDisturbOn />}
              sx={BUTTON_STYLE}
              onClick={(e) => {
                e.stopPropagation();
                setIsInValidate(true);
              }}
            >
              Invalider
            </Button>
          </>
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

      <Dialog
        open={isCanceling}
        onClose={() => {
          setIsCanceling(false);
          setCancelReason("");
        }}
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Demande d'annulation</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              label="Raison de l'annulation"
              placeholder="Veuillez indiquer la raison de votre demande d'annulation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              required
              helperText="Ce champ est obligatoire"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsCanceling(false);
              setCancelReason("");
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelSubmit();
            }}
            variant="contained"
            color="primary"
            disabled={!cancelReason.trim()}
          >
            Confirmer la demande
          </Button>
        </DialogActions>
      </Dialog>

      <Confirm
        isOpen={isValidatingCancel}
        title="Validation d'une annulation"
        content="Souhaitez-vous valider la demande d'annulation de ce rattrapage ?"
        confirm="Valider"
        onConfirm={handleValidateCancel}
        onClose={() => setIsValidatingCancel(false)}
      />

      <Dialog
        open={isRejectingCancel}
        onClose={() => {
          setIsRejectingCancel(false);
          setRejectReason("");
        }}
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rejet de la demande d'annulation</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              label="Raison du rejet"
              placeholder="Veuillez indiquer la raison du rejet de cette demande..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              required
              helperText="Ce champ est obligatoire"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsRejectingCancel(false);
              setRejectReason("");
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRejectSubmit();
            }}
            variant="contained"
            color="warning"
            disabled={!rejectReason.trim()}
          >
            Confirmer le rejet
          </Button>
        </DialogActions>
      </Dialog>

      <Confirm
        isOpen={isValidate}
        title="Validation de rattrapage"
        content={`Voulez-vous valider le rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`}
        confirm="Valider"
        onConfirm={handleValidate}
        onClose={() => setIsValidate(false)}
      />

      <Confirm
        isOpen={isInValidate}
        title="Invalidation de rattrapage"
        content={`Voulez-vous invalider le rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`}
        confirm="Invalider"
        onConfirm={handleInvalidate}
        onClose={() => setIsInValidate(false)}
      />
    </Box>
  );
};
