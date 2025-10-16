import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {Cancel, HowToReg} from "@mui/icons-material";
import {Button, Stack} from "@mui/material";
import {Confirm, useRecordContext} from "react-admin";
import {ButtonActions} from "./ButtonActions";
import {EnrollStatus} from "./EnrollStatus";

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

type EnrollButtonProps = {
  onSuccess?: (retakeExam: RetakeExam) => void;
};

export const Buttons = ({onSuccess}: EnrollButtonProps) => {
  const retakeExam = useRecordContext<RetakeExam>();
  if (!retakeExam) return null;

  const {
    status,
    isLoading,
    confirmOpen,
    cancelConfirmOpen,
    setConfirmOpen,
    setCancelConfirmOpen,
    handleSave,
  } = ButtonActions(retakeExam, onSuccess);

  if (status === "TO_CANCEL" || status === "CANCELED" || status === "LOADING") {
    return <EnrollStatus status={status} />;
  }
  const isRegistered = status === "REGISTERED";
  const action = isRegistered
    ? {
        label: "Annuler",
        color: "error" as const,
        icon: <Cancel />,
        confirmTitle: "Annulation de l'inscription",
        confirmContent: `Êtes-vous sûr de vouloir annuler votre inscription au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`,
        confirmButton: "Annuler l'inscription",
        open: cancelConfirmOpen,
        setOpen: setCancelConfirmOpen,
        nextStatus: "TO_CANCEL" as const,
        successMsg: "Demande d'annulation envoyée.",
        variant: "outlined" as const,
      }
    : {
        label: "S'inscrire",
        color: "primary" as const,
        icon: <HowToReg />,
        confirmTitle: "Confirmation d'inscription",
        confirmContent: `Voulez-vous vraiment vous inscrire au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`,
        confirmButton: "Confirmer l'inscription",
        open: confirmOpen,
        setOpen: setConfirmOpen,
        nextStatus: "REGISTERED" as const,
        successMsg: "Inscription réussie !",
        variant: "contained" as const,
      };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {isRegistered && <EnrollStatus status="REGISTERED" />}
        <Button
          variant={action.variant}
          color={action.color}
          startIcon={action.icon}
          sx={BUTTON_STYLE}
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            action.setOpen(true);
          }}
        >
          {action.label}
        </Button>
      </Stack>

      <Confirm
        isOpen={action.open}
        title={action.confirmTitle}
        content={action.confirmContent}
        confirm={action.confirmButton}
        onConfirm={() => handleSave(action.nextStatus, action.successMsg)}
        onClose={() => action.setOpen(false)}
      />
    </>
  );
};
