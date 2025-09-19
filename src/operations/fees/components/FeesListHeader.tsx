import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {Create} from "@/operations/common/components";
import {FILE_FIELD_STYLE} from "@/operations/letters/CreateLetters";
import {Dialog} from "@/ui/components";
import {NOOP_ID} from "@/utils/constants";
import {formatDate} from "@/utils/date";
import {AdvancedFeeStatisticsType} from "@haapi-b0fc7615/typescript-client";
import {AccountBalance, Payments} from "@mui/icons-material";
import {
  Box,
  Button as ImportButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
import {FeeStats} from "../types";
import {CardFeesContent, FeesStatsHeader} from "./FeeStatsHeader";
import {StatsStatus} from "./StatsStatus";

export const FeesListHeader: FC<{title: string; isMpbs: boolean}> = ({
  title,
  isMpbs = false,
}) => {
  const {filterValues} = useListContext();
  const [viewMode, setViewMode] =
    useState<AdvancedFeeStatisticsType>("ACCOUNTING");
  const mergedFilters = {
    ...(filterValues || {}),
    viewMode,
  };
  const {data: stats} = useGetOne<FeeStats>("stats", {
    id: NOOP_ID,
    meta: {resource: "fees_stats", filters: mergedFilters},
  });

  const isXSmall = useMediaQuery("max-width:768px");

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
        <Box
          display="flex"
          flexDirection={{xs: "column", sm: "row"}}
          justifyContent="space-between"
          gap={2}
          width="100%"
        >
          <Box flex={1} minWidth={0}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                wordBreak: "break-word",
                fontSize: {xs: "1.1rem", sm: "1.25rem"},
              }}
            >
              {title}
            </Typography>
            {filterValues?.monthFrom && filterValues?.monthTo && (
              <Typography
                sx={{
                  "display": "inline-flex",
                  "flexDirection": "row",
                  "width": "fit-content",
                  "alignItems": {xs: "flex-start", sm: "center"},
                  "gap": {xs: "4px", sm: "8px"},
                  "background":
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)",
                  "backdropFilter": "blur(10px)",
                  "padding": {xs: "6px 12px", sm: "8px 16px"},
                  "borderRadius": "12px",
                  "fontSize": {xs: "0.75rem", sm: "0.875rem"},
                  "color": "text.secondary",
                  "margin": "12px 0",
                  "border": "1px solid rgba(255,255,255,0.1)",
                  "boxShadow": "0 4px 12px rgba(0,0,0,0.05)",
                  "transition": "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  },
                  "& span": {
                    fontWeight: 600,
                    color: "primary.main",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "rgba(0,0,0,0.03)",
                    display: "inline-block",
                    margin: {xs: "2px 0", sm: "0 4px"},
                  },
                }}
              >
                Du <span>{formatDate(filterValues?.monthFrom, false)}</span>
                au <span>{formatDate(filterValues?.monthTo, false)}</span>
              </Typography>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection={{xs: "column"}}
            gap={2}
            alignItems={{xs: "stretch", sm: "center"}}
            width={{xs: "100%", sm: "auto"}}
          >
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            {isMpbs ? (
              <ImportButton
                onClick={() => setOpen(true)}
                variant="contained"
                size={isXSmall ? "small" : "medium"}
                sx={{
                  bgcolor: PALETTE_COLORS.primary,
                  height: "fit-content",
                  whiteSpace: {xs: "normal", sm: "nowrap"},
                  fontSize: {xs: "0.75rem", sm: "0.875rem"},
                }}
              >
                Vérifier des transactions
              </ImportButton>
            ) : (
              <StatsStatus stats={stats} />
            )}
          </Box>
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
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Dialog
      onClose={onClose}
      open={onShow}
      title={
        "Importer les transactions venant de Orange Money (sous format excel)"
      }
      maxWidth={isMobile ? "sm" : "md"}
      fullWidth
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
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            sx={FILE_FIELD_STYLE}
            options={{
              onDropAccepted: () => setFileUploaded(true),
              onDropRejected: () => {
                setFileUploaded(false);
                notify(
                  "Mauvais format de fichier. Seuls les fichiers .xls et .xlsx sont acceptés.",
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

const ViewModeToggle: FC<{
  viewMode: AdvancedFeeStatisticsType;
  onViewModeChange: (mode: AdvancedFeeStatisticsType) => void;
}> = ({viewMode, onViewModeChange}) => {
  const isXSmall = useMediaQuery("(max-width:480px)");

  return (
    <Box
      display="flex"
      flexDirection={isXSmall ? "column" : "row"}
      gap={1}
      width={isXSmall ? "100%" : "auto"}
    >
      <Box
        data-testid="viewmode-accounting"
        onClick={() => onViewModeChange("ACCOUNTING")}
        sx={{
          "p": {xs: "6px 12px", sm: "8px 16px"},
          "bgcolor":
            viewMode === "ACCOUNTING" ? "white" : "rgba(255,255,255,0.1)",
          "color": viewMode === "ACCOUNTING" ? PALETTE_COLORS.primary : "white",
          "borderRadius": "12px",
          "cursor": "pointer",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "gap": "6px",
          "transition": "all 0.3s ease",
          "backdropFilter": "blur(10px)",
          "border": "1px solid rgba(255,255,255,0.2)",
          "boxShadow":
            viewMode === "ACCOUNTING" ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
          "flex": isXSmall ? 1 : "none",
          "minWidth": isXSmall ? "100%" : "auto",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <AccountBalance sx={{fontSize: "1rem"}} />
        <Typography fontWeight="600" fontSize={{xs: "0.8rem", sm: "0.9rem"}}>
          Comptable
        </Typography>
      </Box>
      <Box
        data-testid="viewmode-receipt"
        onClick={() => onViewModeChange("RECEIPT")}
        sx={{
          "p": {xs: "6px 12px", sm: "8px 16px"},
          "bgcolor": viewMode === "RECEIPT" ? "white" : "rgba(255,255,255,0.1)",
          "color": viewMode === "RECEIPT" ? PALETTE_COLORS.primary : "white",
          "borderRadius": "12px",
          "cursor": "pointer",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "gap": "6px",
          "transition": "all 0.3s ease",
          "backdropFilter": "blur(10px)",
          "border": "1px solid rgba(255,255,255,0.2)",
          "boxShadow":
            viewMode === "RECEIPT" ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
          "flex": isXSmall ? 1 : "none",
          "minWidth": isXSmall ? "100%" : "auto",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Payments sx={{fontSize: "1rem"}} />
        <Typography fontWeight="600" fontSize={{xs: "0.8rem", sm: "0.9rem"}}>
          Encaissement
        </Typography>
      </Box>
    </Box>
  );
};
