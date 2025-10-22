import {useRole} from "@/security/hooks";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {Cancel, CheckCircle, HowToReg} from "@mui/icons-material";
import {Box, Button, Stack} from "@mui/material";
import {Confirm, useRecordContext} from "react-admin";
import {useButtonActions} from "./ButtonActions";
import {ButtonStatus} from "./ButtonStatus";

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
  const {isAdmin, isManager} = useRole();
  const canValidateCancel = isAdmin() || isManager();
  const {
    status,
    isLoading,
    confirmOpen,
    cancelConfirmOpen,
    adminCancelConfirmOpen,
    setConfirmOpen,
    setCancelConfirmOpen,
    setAdminCancelConfirmOpen,
    handleRegister,
    handleRequestCancel,
    handleValidateCancel,
  } = useButtonActions(retakeExam, onSuccess);
  if (status === "CANCELED" || status === "TO_CANCEL" || status === "LOADING") {
    return <ButtonStatus status={status} />;
  }
  const isRegistered = status === "REGISTERED";

  let action: {
    label: string;
    color: "primary" | "error" | "success";
    icon: JSX.Element;
    confirmTitle: string;
    confirmContent: string;
    confirmButton: string;
    open: boolean;
    setOpen: (value: boolean) => void;
    onConfirm: () => void;
    variant: "contained" | "outlined";
  };

  if (canValidateCancel) {
    action = {
      label: "Valider l'annulation",
      color: "success",
      icon: <CheckCircle />,
      confirmTitle: "Validation d'une annulation",
      confirmContent: `Souhaitez-vous valider la demande d'annulation de ce rattrapage ?`,
      confirmButton: "Valider",
      open: adminCancelConfirmOpen,
      setOpen: setAdminCancelConfirmOpen,
      onConfirm: () => handleValidateCancel(canValidateCancel),
      variant: "contained",
    };
  } else if (isRegistered) {
    action = {
      label: "Annuler",
      color: "error",
      icon: <Cancel />,
      confirmTitle: "Demande d'annulation",
      confirmContent: `Souhaitez-vous demander l'annulation de votre inscription au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`,
      confirmButton: "Confirmer la demande",
      open: cancelConfirmOpen,
      setOpen: setCancelConfirmOpen,
      onConfirm: handleRequestCancel,
      variant: "outlined",
    };
  } else {
    action = {
      label: "S'inscrire",
      color: "primary",
      icon: <HowToReg />,
      confirmTitle: "Confirmation d'inscription",
      confirmContent: `Voulez-vous vous inscrire au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`,
      confirmButton: "Confirmer l'inscription",
      open: confirmOpen,
      setOpen: setConfirmOpen,
      onConfirm: handleRegister,
      variant: "contained",
    };
  }
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        {isRegistered && <ButtonStatus status="REGISTERED" />}
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
        onConfirm={action.onConfirm}
        onClose={() => action.setOpen(false)}
      />
    </Box>
  );
};
