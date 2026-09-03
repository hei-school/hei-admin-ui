import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks/useToggle";
import {renderMoney} from "@/operations/common/utils/money";
import {
  FeeRecord,
  useFeesToArchive,
} from "@/operations/fees/hooks/useFeesToArchive";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {CONFIRM_DIALOG_Z_INDEX} from "@/ui/constants/common_styles";
import {formatDate} from "@/utils/date";
import {ArchiveStatusEnum} from "@haapi-3d601c85/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {Home} from "lucide-react";
import {useState} from "react";
import {Confirm, useNotify} from "react-admin";
import {Link as RouterLink} from "react-router-dom";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import {CATEGORY} from "./constants";

const TABS = [
  {
    key: ArchiveStatusEnum.TO_ARCHIVE,
    label: "À archiver",
    color: PALETTE_COLORS.warning,
  },
  {
    key: ArchiveStatusEnum.REJECTED,
    label: "Rejetés",
    color: PALETTE_COLORS.red,
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const categoryLabel = (fee: FeeRecord) =>
  CATEGORY.find((c) => c.value === fee.category)?.label ?? fee.category ?? "—";

const runArchiveAction = async (
  action: () => Promise<unknown>,
  successMessage: string,
  onDone: () => void,
  notify: ReturnType<typeof useNotify>
) => {
  try {
    await action();
    notify(successMessage, {type: "success"});
    onDone();
  } catch (error) {
    console.error(error);
    notify("Une erreur s'est produite.", {type: "error"});
  }
};

const FeeArchiveRowActions = ({
  fee,
  tab,
  onDone,
}: {
  fee: FeeRecord;
  tab: TabKey;
  onDone: () => void;
}) => {
  const notify = useNotify();
  const [showValidate, , toggleValidate] = useToggle();
  const [showReject, , toggleReject] = useToggle();
  const [showReArchive, , toggleReArchive] = useToggle();
  const {studentId, feeId} = toApiIds(fee.id);

  const doUpdate = (status: ArchiveStatusEnum, successMessage: string) =>
    runArchiveAction(
      () => payingApi().updateFeeArchiveStatus(studentId, feeId, {status}),
      successMessage,
      onDone,
      notify
    );

  const doReArchive = () => {
    toggleReArchive();
    runArchiveAction(
      () => payingApi().archiveStudentFee(studentId, feeId),
      "Demande d'archivage renvoyée.",
      onDone,
      notify
    );
  };

  if (tab === ArchiveStatusEnum.TO_ARCHIVE) {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          color="warning"
          startIcon={<ArchiveIcon />}
          onClick={toggleValidate}
        >
          Archiver
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={toggleReject}
        >
          Rejeter
        </Button>
        <Confirm
          sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
          isOpen={showValidate}
          title="Archivage de frais"
          content="Confirmez-vous l'archivage de ce frais ? Il ne pourra plus être payé ni modifié."
          onConfirm={() => {
            toggleValidate();
            doUpdate(ArchiveStatusEnum.ARCHIVED, "Frais archivé avec succès.");
          }}
          onClose={toggleValidate}
          confirmColor="warning"
          confirm="Archiver"
        />
        <Confirm
          sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
          isOpen={showReject}
          title="Rejet de l'archivage"
          content="Confirmez-vous le rejet de cette demande d'archivage ?"
          onConfirm={() => {
            toggleReject();
            doUpdate(
              ArchiveStatusEnum.REJECTED,
              "Demande d'archivage rejetée."
            );
          }}
          onClose={toggleReject}
          confirmColor="warning"
          confirm="Rejeter"
        />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        size="small"
        variant="outlined"
        color="warning"
        startIcon={<UnarchiveIcon />}
        onClick={toggleReArchive}
      >
        Réarchiver
      </Button>
      <Confirm
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        isOpen={showReArchive}
        title="Réarchivage de frais"
        content="Confirmez-vous l'envoi d'une nouvelle demande d'archivage pour ce frais ?"
        onConfirm={doReArchive}
        onClose={toggleReArchive}
        confirmColor="warning"
        confirm="Réarchiver"
      />
    </Box>
  );
};

const FeesToArchiveList = () => {
  const [tab, setTab] = useState<TabKey>(ArchiveStatusEnum.TO_ARCHIVE);
  const {isAllowed, isLoading, toArchiveFees, rejectedFees, refetch} =
    useFeesToArchive();
  const rows =
    tab === ArchiveStatusEnum.TO_ARCHIVE ? toArchiveFees : rejectedFees;

  return (
    <Box
      sx={{
        width: "calc(100% - 20px)",
        margin: "50px auto",
        borderRadius: "10px",
        boxShadow: "2px 2px 15px rgba(0,0,0,.1)",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <Box sx={{px: 2, pt: 2}}>
        <CustomBreadcrumbs
          items={[
            {
              label: "Tableau de bord",
              component: RouterLink,
              to: "/",
              icon: <Home size={16} />,
            },
            {label: "Archivage des frais"},
          ]}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <ArchiveIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Archivage des frais
        </Typography>
      </Box>

      {!isAllowed ? (
        <Box display="flex" justifyContent="center" py={6}>
          <Typography color="text.secondary">
            Cette page est réservée aux gestionnaires et administrateurs.
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              p: 2,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            {TABS.map((t) => {
              const count =
                t.key === ArchiveStatusEnum.TO_ARCHIVE
                  ? toArchiveFees.length
                  : rejectedFees.length;
              const selected = tab === t.key;
              return (
                <Button
                  key={t.key}
                  size="small"
                  onClick={() => setTab(t.key)}
                  variant={selected ? "contained" : "outlined"}
                  sx={{
                    "borderRadius": 5,
                    "textTransform": "none",
                    "bgcolor": selected ? t.color : "transparent",
                    "borderColor": alpha(t.color, 0.5),
                    "color": selected ? "white" : t.color,
                    "&:hover": {
                      bgcolor: selected ? t.color : alpha(t.color, 0.08),
                    },
                  }}
                >
                  {t.label} ({count})
                </Button>
              );
            })}
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Box display="flex" justifyContent="center" py={6}>
              <Typography color="text.secondary">
                {tab === ArchiveStatusEnum.TO_ARCHIVE
                  ? "Aucun frais en attente d'archivage."
                  : "Aucun frais rejeté."}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{"& th": {fontWeight: 600, bgcolor: "#F0F0F0"}}}>
                  <TableCell>Référence</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Reste à payer</TableCell>
                  <TableCell>Échéance</TableCell>
                  {tab === ArchiveStatusEnum.REJECTED && (
                    <TableCell>Rejeté par</TableCell>
                  )}
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((fee) => (
                  <TableRow key={fee.id} hover>
                    <TableCell>{fee.student_ref}</TableCell>
                    <TableCell>{fee.student_first_name}</TableCell>
                    <TableCell>{categoryLabel(fee)}</TableCell>
                    <TableCell>
                      {renderMoney(fee.remaining_amount ?? 0)}
                    </TableCell>
                    <TableCell>{formatDate(fee.due_datetime)}</TableCell>
                    {tab === ArchiveStatusEnum.REJECTED && (
                      <TableCell>
                        {[fee.archived_by_first_name, fee.archived_by_last_name]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <FeeArchiveRowActions
                        fee={fee}
                        tab={tab}
                        onDone={() => refetch()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </Box>
  );
};

export default FeesToArchiveList;
