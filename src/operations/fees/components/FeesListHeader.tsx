import React, {FC} from "react";
import {
  useGetOne,
  useListContext,
  FileInput,
  FileField,
  SimpleForm,
} from "react-admin";
import {Box, Button as ImportButton, Typography} from "@mui/material";
import {
  CurrencyExchange as Money,
  AttachMoney,
  Cancel,
  Pending,
  Check,
  CalendarMonth,
  LinearScale,
} from "@mui/icons-material";
import {Dialog} from "@/ui/components";
import {ListHeader} from "@/operations/common/components";
import {CardContent} from "@/operations/common/components/ListHeader";
import {NOOP_ID} from "@/utils/constants";
import {FILE_FIELD_STYLE} from "@/operations/letters/CreateLetters";

const INITIAL_STATS = {
  total_fees: "...",
  paid_fees: "...",
  unpaid_fees: "...",
  late_fees: "...",
  pending_transaction: "...",
  paid_by_transaction: "...",
  total_monthly_fees: "...",
  total_yearly_fees: "...",
};

// TODO: Add this to ByStatusFeeList
export const FeesListHeader = () => {
  const {filterValues} = useListContext();
  const {data: stats = INITIAL_STATS} = useGetOne("stats", {
    id: NOOP_ID,
    meta: {resource: "fees", filters: filterValues},
  });

  const headerCardContent: CardContent[] = [
    {
      title: "Total des frais",
      icon: <AttachMoney fontSize="medium" />,
      total: stats.total_fees!,
      statDetails: [
        {
          icon: <Check fontSize="medium" />,
          total: stats.paid_fees!,
          title: "Frais payés",
        },
        {
          icon: <Pending fontSize="medium" />,
          total: stats.unpaid_fees!,
          title: "Frais en cours",
        },
        {
          icon: <Cancel fontSize="medium" />,
          total: stats.late_fees!,
          title: "Frais en retard",
        },
      ],
    },
    {
      title: "Transactions",
      icon: <Money fontSize="medium" />,
      total: stats.unpaid_fees!,
      statDetails: [
        {
          icon: <Pending fontSize="medium" />,
          total: stats.pending_transaction!,
          title: "Transactions en cours de vérification",
        },
        {
          icon: <Check fontSize="medium" />,
          total: stats.paid_by_transaction!,
          title: "Transactions vérifiées avec succès",
        },
      ],
    },
    {
      title: "Frais mensuels",
      icon: <CalendarMonth fontSize="medium" />,
      total: stats.total_monthly_fees ?? "...",
    },
    {
      title: "Frais annuels",
      icon: <LinearScale fontSize="medium" />,
      total: stats.total_yearly_fees ?? "...",
    },
  ];
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ListHeader
      cardContents={headerCardContent}
      title={
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Statistiques des frais de ce mois-ci
          </Typography>
          <ImportButton onClick={handleClickOpen} variant="contained">
            Importer
          </ImportButton>
          <ImportDialog OnShow={open} onClose={handleClose} />
        </Box>
      }
    />
  );
};

const ImportDialog: FC<{OnShow: boolean; onClose: () => void}> = ({
  OnShow,
  onClose,
}) => {
  return (
    <Dialog onClose={onClose} open={OnShow} title={"Importer le fichier excel"}>
      <SimpleForm>
        <FileInput
          source=""
          accept=".xlsx,.xls,.gsheet"
          sx={FILE_FIELD_STYLE}
          multiple={true}
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Dialog>
  );
};
