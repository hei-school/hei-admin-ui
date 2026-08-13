import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {alpha, Box, Chip, Typography} from "@mui/material";
import {MoveRight, Wallet} from "lucide-react";
import {Button, Link, useGetList} from "react-admin";

const ACCENT_COLOR = "#10B981";

export const PendingCreditPayments = ({animate}: {animate: boolean}) => {
  const role = useRole();
  const {data: pendingPayments} = useGetList(
    "credit-payments",
    {
      filter: {status: PaymentStatus.CREATED},
      pagination: {page: 1, perPage: 500},
    },
    {
      enabled: role.isManager() || role.isAdmin(),
    }
  );
  const pendingCount = pendingPayments?.length ?? 0;
  return (
    <Box
      sx={{
        mb: 4,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease-out 0.7s",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" gap="1rem">
          <Wallet color={ACCENT_COLOR} />
          <Typography variant="h6" fontWeight="bold">
            Paiements par crédit à valider
          </Typography>
        </Box>
        <Chip
          label={`${pendingCount} en attente`}
          color="info"
          size="small"
          sx={{
            fontWeight: "bold",
            bgcolor: alpha(ACCENT_COLOR, 0.1),
            color: ACCENT_COLOR,
            border: `1px solid ${alpha(ACCENT_COLOR, 0.2)}`,
          }}
        />
      </Box>
      <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
        <Button
          component={Link}
          variant="text"
          to={"/credit-payments"}
          endIcon={
            <MoveRight
              style={{
                fontWeight: 700,
              }}
            />
          }
          sx={{
            "textTransform": "none",
            "padding": "0.3rem 0.8rem",
            "color": ACCENT_COLOR,
            "&:hover": {
              borderColor: PALETTE_COLORS.yellow,
              bgcolor: alpha(PALETTE_COLORS.yellow, 0.1),
              color: PALETTE_COLORS.yellow,
            },
          }}
          label="Voir tous les paiements"
        />
      </Box>
    </Box>
  );
};
