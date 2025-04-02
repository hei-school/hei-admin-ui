import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {Create} from "@/operations/common/components";
import {FILE_FIELD_STYLE} from "@/operations/letters/CreateLetters";
import {Dialog} from "@/ui/components";
import {NOOP_ID} from "@/utils/constants";
import {AdvancedFeesStatistics} from "@haapi/typescript-client";
import {Box, Button as ImportButton, Typography} from "@mui/material";
import {
  AlertTriangle,
  BadgeDollarSign,
  CircleCheckBig,
  RefreshCw,
} from "lucide-react";
import {FC, useState} from "react";
import {
  FileField,
  FileInput,
  SimpleForm,
  useGetOne,
  useListContext,
  useRefresh,
} from "react-admin";
import {v4 as uuid} from "uuid";
import {CardFeesContent, FeesStatsHeader} from "./FeeStatsHeader";

export const FeesListHeader: FC<{title: string; isMpbs: boolean}> = ({
  title,
  isMpbs = false,
}) => {
  const {filterValues} = useListContext();
  const {data: stats} = useGetOne<AdvancedFeesStatistics & {id: string}>(
    "stats",
    {
      id: NOOP_ID,
      meta: {resource: "fees_stats", filters: filterValues},
    }
  );

  const headerCardContent: CardFeesContent[] = [
    {
      title: "Total des frais",
      icon: <BadgeDollarSign fontSize="medium" />,
      L1: stats?.total_expected_fees_count?.first_grade,
      L2: stats?.total_expected_fees_count?.second_grade,
      R: 0,
      L3: stats?.total_expected_fees_count?.third_grade,
      A: stats?.total_expected_fees_count?.work_study,
      mensual: stats?.total_expected_fees_count?.monthly,
      annual: stats?.total_expected_fees_count?.yearly,
    },
    {
      title: "Frais payés",
      icon: <CircleCheckBig fontSize="medium" />,
      L1: stats?.paid_fees_count?.first_grade,
      L2: stats?.paid_fees_count?.second_grade,
      L3: stats?.paid_fees_count?.third_grade,
      R: stats?.paid_fees_count?.remedial_fees_count,
      A: stats?.paid_fees_count?.work_study,
      mensual: stats?.paid_fees_count?.monthly,
      annual: stats?.paid_fees_count?.yearly,
      bank_fees: stats?.paid_fees_count?.bank_fees,
      mobile_money: stats?.paid_fees_count?.mobile_money,
    },
    {
      title: "En cours de vérification",
      icon: <RefreshCw fontSize="medium" />,
      L1: stats?.pending_fees_count?.first_grade,
      L2: stats?.pending_fees_count?.second_grade,
      L3: stats?.pending_fees_count?.third_grade,
      A: stats?.pending_fees_count?.work_study,
      R: stats?.pending_fees_count?.remedial_fees_count,
      mensual: stats?.pending_fees_count?.monthly,
      annual: stats?.pending_fees_count?.yearly,
    },
    {
      title: "Frais En retard",
      icon: <AlertTriangle fontSize="medium" />,
      L1: stats?.late_fees_count?.first_grade,
      L2: stats?.late_fees_count?.second_grade,
      L3: stats?.late_fees_count?.third_grade,
      R: stats?.late_fees_count?.remedial_fees_count,
      A: stats?.late_fees_count?.work_study,
      mensual: stats?.late_fees_count?.monthly,
      annual: stats?.late_fees_count?.yearly,
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <FeesStatsHeader
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
