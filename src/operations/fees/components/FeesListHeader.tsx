import {FC, useState} from "react";
import {
  useGetOne,
  useListContext,
  FileInput,
  FileField,
  SimpleForm,
  useRefresh,
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
import {Create, ListHeader} from "@/operations/common/components";
import {CardContent} from "@/operations/common/components/ListHeader";
import {useNotify} from "@/hooks";
import {NOOP_ID} from "@/utils/constants";
import {FILE_FIELD_STYLE} from "@/operations/letters/CreateLetters";
import {PALETTE_COLORS} from "@/haTheme";
import {v4 as uuid} from "uuid";

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
export const FeesListHeader: FC<{title: string; isMpbs: boolean}> = ({
  title,
  isMpbs = false,
}) => {
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
  const [open, setOpen] = useState(false);

  return (
    <ListHeader
      cardContents={headerCardContent}
      title={
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {isMpbs && (
            <ImportButton
              onClick={() => setOpen(true)}
              variant="contained"
              sx={{bgcolor: PALETTE_COLORS.primary}}
            >
              Vérifier des transactions
            </ImportButton>
          )}
          <ImportDialog onShow={open} onClose={() => setOpen(false)} />
        </Box>
      }
    />
  );
};

const ImportDialog: FC<{onShow: boolean; onClose: () => void}> = ({
  onShow: onShow,
  onClose,
}) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <Dialog
      onClose={onClose}
      open={onShow}
      title={
        "Importer les transactions venant de Orange Money (sous format excel)"
      }
    >
      <Create
        title=" "
        redirect={false}
        resource="mpbs-verify"
        mutationOptions={{
          onSuccess: () => {
            notify("Transactions importées.", {type: "success"});
            onClose();
            refresh();
          },
        }}
        transform={(mpbsFile: any) => {
          return {
            id: uuid(),
            ...mpbsFile,
          };
        }}
      >
        <SimpleForm
          onSubmit={fileUploaded ? undefined : () => {}}
          disabled={!fileUploaded}
        >
          <FileInput
            source="mpbsFile"
            label=" "
            accept=".xlsx, .xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            sx={FILE_FIELD_STYLE}
            options={{
              onDropAccepted: () => setFileUploaded(true),
              onDropRejected: () => {
                setFileUploaded(false);
                notify(
                  "Mauvais format de fichier. Seuls les fichiers .xlsx et .xls sont acceptés.",
                  {type: "warning"}
                );
              },
            }}
          >
            <FileField source="src" title="title" />
          </FileInput>
        </SimpleForm>
      </Create>
    </Dialog>
  );
};
